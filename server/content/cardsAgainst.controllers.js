(function() {
  angular.module('cardsAgainstApp')
    .controller('RegisterCtrl', registerCtrl)
    .controller('LobbyCtrl', lobbyCtrl);

  function registerCtrl(GameService, $location) {
    var vm = this;

    vm.registerName = function() {
      GameService.registerPlayer(vm.username);
      $location.url('/lobby')
    }
  }

  function lobbyCtrl(GameService, $scope) {
    var vm = this;

    vm.playerId = GameService.playerInfo.playerId;
    vm.userRole = GameService.playerInfo.userRole;
  }
})();