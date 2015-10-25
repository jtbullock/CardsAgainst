(function() {

  angular
    .module('cardsAgainstApp')
    .directive('gameCards', gameCards)
    .controller('GameCardsController', GameCardsController);

  function gameCards() {
    return {
      restrict: 'A',
      controller: 'GameCardsController',
      controllerAs: 'vm',
      bindToController: true,
      templateUrl: 'templates/cardsAgainst.directives.gameCards.html'
    };
  }

  function GameCardsController(GameService) {
    var vm = this;
    var selected;

    vm.playerData = GameService.playerData;

    vm.selected = function(card) {
      return !!selected && selected === card;
    };

    vm.select = function(card) {
      selected = card;
    };

    vm.submitSelection = function() {
      GameService.choosePlayerCard(selected);
    };
  }

})();
