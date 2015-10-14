(function() {
  "use strict";

  angular
    .module('cardsAgainstApp.game')
    .directive('playerList', playerList);

  function playerList() {
    return {
      restrict: 'A',
      controller: 'PlayerListController',
      controllerAs: 'vm',
      bindToController: true,
      templateUrl: 'modules/game/templates/playerList.html'
    }
  }

})();
