(function() {

  angular
    .module('cardsAgainstApp')
    .directive('playerCards', playerCards)
    .controller('PlayerCardsController', PlayerCardsController);

  function playerCards() {
    return {
      restrict: 'A',
      controller: 'PlayerCardsController',
      controllerAs: 'vm',
      bindToController: true,
      templateUrl: 'templates/cardsAgainst.directives.playerCards.html'
    };
  }

  function PlayerCardsController(GameService, $scope) {
    var vm = this;
    var selected;

    vm.cards = GameService.playerData.cards;
    $scope.$on(GameService.events.draw_cards, function(event, cards) {
      console.log('set cards');
      console.log(cards);
      vm.cards = cards;
    });

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
