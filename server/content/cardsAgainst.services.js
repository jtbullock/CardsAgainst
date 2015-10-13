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

    svc.registerPlayer = function(playerName) {
      gameSocket.emit('register player', playerName);
    };

    svc.startListeners = function() {
      gameSocket.on('player joined', function(players) {
        angular.copy(players, svc.players);
      });
    };

    return svc;
  }
})();
