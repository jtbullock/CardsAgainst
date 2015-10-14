(function() {
  angular
    .module('cardsAgainstApp.game')
    .directive('gameLobby', gameLobby);

  function gameLobby() {
    return {
      restrict: 'A',
      require: '^GameController',
      templateUrl: 'templates/gameLobby.html'
    };
  }

})();
