(function() {

  angular
    .module('cardsAgainstApp')
    .directive('debugPanel', debugPanel)
    .controller('DebugPanelController', DebugPanelController);

  function debugPanel() {
    return {
      restrict: 'A',
      controller: 'DebugPanelController',
      controllerAs: 'vm',
      scope: {},
      bindToController: true,
      templateUrl: 'templates/debugPanel.html'
    };
  }

  function DebugPanelController(GameService) {
    var vm = this;

    vm.gameData = GameService.gameData;
    vm.roundData = GameService.roundData;
    vm.playerData = GameService.playerData;
  }

})();
