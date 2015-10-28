(function() {

  angular
    .module('cardsAgainstApp')
    .directive('gameTopic', gameTopic)
    .controller('GameTopicController', GameTopicController);

  function gameTopic() {
    return {
      restrict: 'A',
      controller: 'GameTopicController',
      controllerAs: 'vm',
      bindToController: true,
      scope: {},
      templateUrl: 'templates/cardsAgainst.directives.gameTopic.html',
      link: function(scope, element, attributes) {
        $(element)
          .addClass('game-topic');
      }
    };
  }

  function GameTopicController(GameService, $interval) {
    var vm = this;

    vm.roundData = GameService.roundData;
  }

})();
