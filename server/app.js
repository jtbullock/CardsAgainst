var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var cookieSession = require('cookie-session');
var guid = require('guid');
var bodyParser = require('body-parser')

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

// --------------------------
// Routes
app.get('/', function (req, res) {
    if(req.session.isNew) {
        var userGuid = guid.raw();
        req.session.userId = guid.raw();
    }

    res.sendFile('views/index.html', { root: __dirname });
});

// --------------------------
// Socket.IO
io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
    socket.on('player joined', function(playerName) {
        var userId=socket.request.headers.cookie.userId;

        players.push({id: userId, name: playerName});

        console.log("Added player: " + playerName);

        socket.emit('player joined', players);
    });
});
