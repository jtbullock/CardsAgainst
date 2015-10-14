(function() {
  angular
    .module('cardsAgainstApp.game')
    .directive('gameRegister', gameRegister);

  function gameRegister() {
    return {
      restrict: 'A',
      require: '^GameController',
      templateUrl: 'templates/gameRegister.html'
    };
  }

})();
