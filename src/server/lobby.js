var _ = require('lodash');

var Game = require('./game');
var Player = require('./player');

module.exports = Lobby;

// Add events directly onto the constructor
_.extend(Lobby, {
  player_join:      'player joined',
  player_left:      'player left',
  register_success: 'register success'
});

function Lobby(nsp) {
  var lobby = this;
  var players = [];
  var host;

  lobby.register = function(player) {
    if(!host) host = player;
    player.isHost = (host === player);

    players.push(player);

    console.log("Player Registered (%s, %s)\t\t[Now %s Players]",
      player.name,
      player.isHost?'host':'not host',
      players.length
    );

    // Update everyone with the new user
    nsp.emit(Lobby.player_join, playerList());

    // Send the player his/her information
    player.socket.emit(Lobby.register_success, player.getData());

    // Host Listeners
    if(player.isHost) {
      player.socket.on(Player.new_game, function(settings) {
        var game = new Game(settings, nsp, activePlayers(), host);
        game.start();
      });
    }
  };

  lobby.unregister = function (player) {
    _.pull(players, player);

    console.log("Player Left (%s, %s)\t\t[Now %s Players]",
      player.name,
      player.isHost?'host':'not host',
      players.length
    );

    nsp.emit(Lobby.player_left, playerList());
  };

  function playerList() {
    return _.invoke(players, 'getPublicData');
  }

  function activePlayers() {
    return _.where(players, { active: true });
  }
}
