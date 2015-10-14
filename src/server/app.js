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
    req.session.testText = "Abc";
  }

  if(numberOfPlayers == 0) {
    req.session.userRole = 'host';
  }
  else {
    req.session.userRole = 'player';
  }

  numberOfPlayers++;
  console.log("User connected. Number of users: " + numberOfPlayers);

  res.sendFile(path.join(__dirname, '/views/index.html'));
});

// --------------------------
// Socket.IO
io.use(socketSessionMiddleware);

io.on('connection', function (socket) {
  socket.on('register player', function(playerName) {
    var userId = socket.handshake.session.userId;
    var userRole = socket.handshake.session.userRole;

    players.push({id: userId, name: playerName, socket: socket});

    console.log("Added player: " + playerName);

    io.emit('player joined', players.map(function(player) {
      return {name: player.name}
    }));

    var playerInfo = {
      playerId: userId,
      userRole: userRole
    };

    console.dir(playerInfo);

    socket.emit('player info', playerInfo);
  });

  socket.on('disconnect', function() {
    numberOfPlayers--;
    console.log("User disconnected.  Users: " + numberOfPlayers)
  });
});
