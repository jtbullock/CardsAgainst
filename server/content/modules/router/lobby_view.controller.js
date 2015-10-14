(function() {
  "use strict";

  angular
    .module('cardsAgainst.router')
    .controller('LobbyCtrl', lobbyCtrl);

  function lobbyCtrl(GameService, $scope) {
    var vm = this;

    // For angular to automatically watch a service property,
    // it needs to be an object, not a primitive.
    vm.playerData = GameService.playerInfo;

    vm.playerId = vm.playerData.playerId;
    vm.userRole = vm.playerData.userRole;
  }
})();
