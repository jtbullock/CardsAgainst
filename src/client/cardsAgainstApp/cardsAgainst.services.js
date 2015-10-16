(function() {
  angular.module('cardsAgainstApp')
    .factory('gameSocket', gameSocketFactory)
    .factory('GameService', gameServiceFactory);

  function gameSocketFactory(socketFactory) {
    return socketFactory();
  }

  function gameServiceFactory(gameSocket) {
    var svc = {};

    svc.players = [];

    svc.playerInfo = {playerId: 0};

    svc.registerPlayer = function(playerName) {
      gameSocket.emit('register player', playerName);
    };

    svc.startListeners = function() {
      gameSocket.on('player joined', function(players) {
        angular.copy(players, svc.players);
      });

      gameSocket.on('player left', function(players) {
        angular.copy(players, svc.players);
      });

      gameSocket.on('player info', function(gameInfo) {
        console.log('recieved player info');
        console.log(gameInfo);
        angular.copy(gameInfo.playerInfo, svc.playerInfo);
        angular.copy(gameInfo.players, svc.players);
      });
    };

    return svc;
  }
})();
