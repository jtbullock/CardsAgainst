(function() {
  "use strict";

  angular
    .module('cardsAgainstApp.core')
    .factory('GameService', gameServiceFactory);

  gameServiceFactory.$inject = [
    "gameSocket"
  ];

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

      gameSocket.on('player info', function(playerInfo) {
        console.log(playerInfo.playerId);
        console.log(playerInfo.userRole);
        angular.copy(playerInfo, svc.playerInfo);
      });
    };

    return svc;
  }

})();
