(function() {

  angular
    .module('cardsAgainstApp')
    .directive('judgeCards', judgeCards)
    .controller('JudgeCardsController', JudgeCardsController);

  function judgeCards() {
    return {
      restrict: 'A',
      controller: 'JudgeCardsController',
      controllerAs: 'vm',
      bindToController: true,
      templateUrl: 'templates/cardsAgainst.directives.judgeCards.html'
    };
  }

  function JudgeCardsController(GameService, $scope) {
    var vm = this;
    var selected;

    vm.cards = GameService.roundData.playerChoices;
    $scope.$on(GameService.events.player_choices, function(event, choices) {
      vm.cards = choices;
    });

    vm.selected = function(card) {
      return !!selected && selected === card;
    };

    vm.select = function(card) {
      selected = card;
    };

    vm.submitSelection = function() {
      GameService.chooseRoundWinner(selected);
    };
  }

})();
