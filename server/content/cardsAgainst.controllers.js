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

    // For angular to automatically watch a service property,
    // it needs to be an object, not a primitive.
    console.log("Mapping to stuffs...");

    vm.playerData = GameService.playerInfo;
    //
    //vm.playerId = vm.playerData.playerId;
    //vm.userRole = vm.playerData.userRole;
  }
})();