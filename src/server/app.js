var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var cookieSession = require('cookie-session');
var guid = require('guid');
var bodyParser = require('body-parser');
var path = require('path');

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
var numberOfPlayers = 0;

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

  res.sendFile(path.join(__dirname, '/views/index.html'));
});

// --------------------------
// Socket.IO
io.use(socketSessionMiddleware);

io.on('connection', function (socket) {
  console.log("Anonymous Connect");

  //returns a version of the player object free of private info
  var safe = function(player) {
    return {
      name: player.name
    }
  }
  var player;

  // User has picked a username
  socket.on('register player', function(playerName) {
    //setup the new player
    player = {
      id: socket.handshake.session.userId,
      name: playerName,
      host: (players.length === 0)
    };
    players.push(player);

    console.log("Player Registered (%s, %s)\t\t[Now %s Players]",
      player.name,
      player.host?'host':'not host',
      players.length
    );

    // Update everyone with the new user
    io.emit('player joined', {
      name: safe(player),
      players: players.map(safe)
    });

    // Send the player his/her information
    socket.emit('player info', player);
  });

  // Handle player disconnect
  socket.on('disconnect', function() {
    var removed = players.some(function(current, index) {
      if(player.id == current.id) {
        players.splice(index,1);
        return true;
      }
    });

    if(removed) {
      console.log("Player Left (%s, %s)\t\t[Now %s Players]",
        player.name,
        player.host?'host':'not host',
        players.length
      );
      // Update everyone with the lost user
      io.emit('player left', {
        name: safe(player.name),
        players: players.map(safe)
      });
    }
  });
});
