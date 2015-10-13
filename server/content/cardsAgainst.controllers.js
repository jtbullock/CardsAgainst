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

  function lobbyCtrl(GameService) {
    var vm = this;

    vm.players = GameService.players;
  }
})();