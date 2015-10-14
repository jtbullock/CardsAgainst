(function() {
  angular
    .module('cardsAgainstApp.game')
    .directive('game', game);

  function game() {
    return {
      restrict: 'A',
      controller: 'GameController',
      controllerAs: 'vm',
      bindToController: true,
      scope: {},
      templateUrl: 'templates/game.html'
    };
  }

})();
