(function() {

  angular
    .module('cardsAgainstApp')
    .directive('playerList', playerList)
    .controller('PlayerListController', playerListController);

  function playerList() {
    return {
      restrict: 'A',
      controller: 'PlayerListController',
      controllerAs: 'vm',
      bindToController: true,
      templateUrl: 'templates/cardsAgainst.directives.playerList.html'
    };
  }

  function playerListController(GameService) {
    var vm = this;

    vm.players = GameService.players;
  }

})();