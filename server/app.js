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
// Global In-memory game state
var players = [];

// --------------------------
// Middleware
app.set('trust proxy', 1) // trust first proxy

app.use(cookieSession({
    name: 'GuestSession',
    keys: ['Zhpb&4^-~[K$w3>&', '[{xwMM:4xSV:As`e']
}));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "content")));

// --------------------------
// Routes
app.get('/', function (req, res) {
    if(req.session.isNew) {
        var userGuid = guid.raw();
        req.session.userId = guid.raw();
    }

    res.sendFile(path.join(__dirname, '/views/index.html'));
});

// --------------------------
// Socket.IO
io.on('connection', function (socket) {
    socket.on('register player', function(playerName) {
        var userId=socket.request.headers.cookie.userId;

        players.push({id: userId, name: playerName});

        console.log("Added player: " + playerName);

        socket.emit('player joined', players);
    });
});