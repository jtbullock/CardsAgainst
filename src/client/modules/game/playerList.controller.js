(function() {
  angular
    .module('cardsAgainstApp.game')
    .controller('PlayerListController', playerListController);

  playerListController.$inject = [
    "GameService"
  ];

  function playerListController(GameService) {
    var vm = this;

    vm.players = GameService.players;
  }

})();
