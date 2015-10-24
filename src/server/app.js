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
app.set('trust proxy', 1); // trust first proxy

var thisCookieSession = cookieSession({
  name: 'GuestSession',
  keys: ['Zhpb&4^-~[K$w3>&', '[{xwMM:4xSV:As`e']
});

app.use(thisCookieSession);

// Request Parsing
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  if(req.session.isNew) {
    var userGuid = guid.raw();
    req.session.userId = userGuid;
  }

  next();
});

// Serving static resources
app.use(express.static(path.join(__dirname, "assets")));

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
      id: socket.handshake.session.userId,
      name: playerName,
      socket: socket
    };

    if(players.length === 0) host = player;

    players.push(player);

    console.log("Player Registered (%s, %s)\t\t[Now %s Players]",
      player.name,
      player===host?'host':'not host',
      players.length
    );

    // Update everyone with the new user
    io.emit(EVENTS.socket.player_join, players.map(publicInfo));

    // Send the player his/her information
    socket.emit(EVENTS.socket.player_info, {
      players: players.map(publicInfo),
      playerInfo: privateInfo(player)
    });

    // Host Listeners
    if(player === host) {
      socket.on(EVENTS.socket.new_game, function(gameSettings) {

        var game = new Game(gameSettings, activePlayers(), host);

        // Broadcast game states

        game.on(EVENTS.game.game_start, function() {
          io.emit(EVENTS.socket.game_ready);
        });

        game.on(EVENTS.game.new_judge, function(judge) {
          console.log('%s is judge', judge.name);
          judge.socket.emit(EVENTS.socket.make_judge);
        });

        game.start();
      });
    }
  });

  // Handle player disconnect
  socket.on('disconnect', function() {
    if(!player) return;

    _.pull(players, player);

    console.log("Player Left (%s, %s)\t\t[Now %s Players]",
      player.name,
      player===host?'host':'not host',
      players.length
    );

    io.emit(EVENTS.socket.player_left, players.map(publicInfo));
  });

  /**
  * Returns a player's public info
  */
  function publicInfo(player) {
    return _(player)
      .omit('socket')
      .omit('id')
      .value();
  }

  function privateInfo(player) {
    return _(player)
      .omit('socket')
      .set('host', player === host)
      .value();
  }

  function activePlayers() {
    return _(players)
      .where('active')
      .value();
  }
});
