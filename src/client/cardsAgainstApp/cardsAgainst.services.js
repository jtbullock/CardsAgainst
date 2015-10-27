(function() {
  angular.module('cardsAgainstApp')
    .factory('GameService', gameServiceFactory);

  var server_events = {
    player_join:      'player joined',
    player_left:      'player left',
    player_info:      'player info',
    game_ready:       'game ready',
    make_judge:       'make judge'
  };
  var client_events = {
    register_player:  'register player',
    new_game:         'new game'
  };
  var namespace =     'gamesocket:';

  function gameServiceFactory($location, socketFactory) {
    var svc = {};
    var gameSocket = socketFactory({
      prefix: namespace
    });

    svc.events = {};

    svc.players = [];

    //default game settings
    svc.settings = {
      gameTime: 60,
      judgeTime: 30,
      winningPoints: 10
    };

    svc.playerInfo = {};

    svc.registerPlayer = function(playerName) {
      gameSocket.emit(client_events.register_player, playerName);
    };

    svc.newGame = function() {
      gameSocket.emit(client_events.new_game, svc.settings);
    };

    svc.startListeners = function() {
      gameSocket.on(server_events.player_join, function(players) {
        angular.copy(players, svc.players);
      });

      gameSocket.on(server_events.player_left, function(players) {
        angular.copy(players, svc.players);
      });

      gameSocket.on(server_events.game_ready, function() {
        $location.url('/game');
      });

      gameSocket.on(server_events.make_judge, function() {
        console.log('make judge');
        svc.playerInfo.judge = true;
      });

      gameSocket.on(server_events.player_info, function(gameInfo) {
        console.log('recieved player info');
        console.log(gameInfo);
        angular.copy(gameInfo.playerInfo, svc.playerInfo);
        angular.copy(gameInfo.players, svc.players);
      });
    };

    Object.keys(server_events).forEach(function(key) {
      svc.events[key] = namespace + server_events[key];
      gameSocket.forward(server_events[key]);
    });

    return svc;

  }
})();
