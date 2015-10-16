(function() {
  angular.module('cardsAgainstApp')
    .factory('gameSocket', gameSocketFactory)
    .factory('GameService', gameServiceFactory);

  function gameSocketFactory(socketFactory) {
    return socketFactory();
  }

  function gameServiceFactory(gameSocket, EVENTS) {
    var svc = {};

    svc.players = [];

    svc.playerInfo = {playerId: 0};

    svc.registerPlayer = function(playerName) {
      gameSocket.emit(EVENTS.socket.register_player, playerName);
    };

    svc.startListeners = function() {
      gameSocket.on(EVENTS.socket.player_join, function(players) {
        angular.copy(players, svc.players);
      });

      gameSocket.on(EVENTS.socket.player_left, function(players) {
        angular.copy(players, svc.players);
      });

      gameSocket.on(EVENTS.socket.player_info, function(gameInfo) {
        console.log('recieved player info');
        console.log(gameInfo);
        angular.copy(gameInfo.playerInfo, svc.playerInfo);
        angular.copy(gameInfo.players, svc.players);
      });
    };

    return svc;
  }
})();
