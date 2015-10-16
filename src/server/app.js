var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var cookieSession = require('cookie-session');
var guid = require('guid');
var bodyParser = require('body-parser');
var path = require('path');
var _ = require('lodash');

var Game = require('./game');

var EVENTS = require('./EVENTS');

server.listen(8082);

// --------------------------
// Custom Middleware

// This is inserted into the request handler for a socket handler.
// Before socket.io event handler, we pass the request to cookie-session
// to parse out the cookies.
var socketSessionMiddleware = function(socket, next) {
  var req = socket.handshake,
    res = {};

  thisCookieSession(req, res, function() {
    next();
  });
};

// --------------------------
// Global In-memory game state
var players = [];
var host;

// --------------------------
// Middleware

// Session/cookies
app.set('trust proxy', 1) // trust first proxy

var thisCookieSession = cookieSession({
  name: 'GuestSession',
  keys: ['Zhpb&4^-~[K$w3>&', '[{xwMM:4xSV:As`e']
});

app.use(thisCookieSession);

// Request Parsing
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serving static resources
app.use(express.static(path.join(__dirname, "assets")));

// --------------------------
// Routes
app.get('/', function (req, res) {
  if(req.session.isNew) {
    var userGuid = guid.raw();
    req.session.userId = userGuid;
  }

  res.sendFile(path.join(__dirname, '/assets/index.html'));
});

// --------------------------
// Socket.IO
io.use(socketSessionMiddleware);

io.on('connection', function (socket) {
  console.log("Anonymous Connect");

  var player;

  // User has picked a username
  socket.on(EVENTS.socket.register_player, function(playerName) {
    //setup the new player
    player = {
      info: {
        id: socket.handshake.session.userId,
        name: playerName,
        host: (players.length === 0),
      },
      socket: socket
    };

    players.push(player);

    if(player.info.host) host = player;

    console.log("Player Registered (%s, %s)\t\t[Now %s Players]",
      player.info.name,
      player.info.host?'host':'not host',
      players.length
    );

    // Update everyone with the new user
    io.emit(EVENTS.socket.player_join, players.map(publicInfo));

    // Send the player his/her information
    socket.emit(EVENTS.socket.player_info, {
      players: players.map(publicInfo),
      playerInfo: player.info
    });

    // Host Listeners
    if(player.info.host) {
      socket.on(EVENTS.socket.new_game, function(gameSettings) {

        var game = new Game(gameSettings, {
          firstJudge: host.id,
          waitForPlayers: players.map(function(player) {
            return player.info.id;
          })
        });

        // Setup game player listeners

        players.forEach(function(player) {
          player.socket.on(EVENTS.socket.join_game, function() {
            game.playerJoin(player.info.id);
          });
        });

        // Broadcast game states

        game.on(EVENTS.game.start_join, function() {
          io.emit(EVENTS.socket.game_ready);
        });

        game.on(EVENTS.game.new_judge, function(judgeId) {
          var judge = _.find(players, function(player) {
            return player.info.id == judgeId;
          });
          console.log('%s is judge', judge.info.name);
          judge.socket.emit(EVENTS.socket.make_judge);
        });

        game.start();
      });
    }
  });

  // Handle player disconnect
  socket.on('disconnect', function() {
    if(!player) return;

    var removed = players.some(function(current, index) {
      if(player.info.id == current.info.id) {
        players.splice(index,1);
        return true;
      }
    });

    if(removed) {
      console.log("Player Left (%s, %s)\t\t[Now %s Players]",
        player.info.name,
        player.info.host?'host':'not host',
        players.length
      );
      // Update everyone with the lost user
      io.emit(EVENTS.socket.player_left, players.map(publicInfo));
    }
  });

  /**
  * Returns a player's public info
  */
  function publicInfo(player) {
    return {
      name: player.info.name
    };
  }
});
