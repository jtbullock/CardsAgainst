var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var cookieSession = require('cookie-session');
var guid = require('guid');
var bodyParser = require('body-parser');
var path = require('path');
var _ = require('lodash');

var Player = require('./player');
var Lobby = require('./lobby');

var lobby;

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
  socket.on(Player.register_player, function(playerName) {
    if(!lobby) lobby = new Lobby(io.sockets);

    //setup the new player
    player = new Player(socket, playerName, {
      id: socket.handshake.session.userId
    });

    lobby.register(player);
  });

  // Handle player disconnect
  socket.on('disconnect', function() {
    if(player) lobby.unregister(player);
  });
});
