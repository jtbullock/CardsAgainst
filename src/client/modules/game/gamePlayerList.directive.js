(function() {
  angular
    .module('cardsAgainstApp.game')
    .directive('gamePlayerList', gamePlayerList);

  function gamePlayerList() {
    return {
      restrict: 'A',
      require: '^GameController',
      templateUrl: 'templates/gamePlayerList.html'
    };
  }

})();
