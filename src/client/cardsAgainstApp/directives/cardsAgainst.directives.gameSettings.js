(function() {

  angular
    .module('cardsAgainstApp')
    .directive('gameSettings', gameSettings)
    .controller('GameSettingsController', GameSettingsController);

  function gameSettings() {
    return {
      restrict: 'A',
      controller: 'GameSettingsController',
      controllerAs: 'vm',
      bindToController: true,
      templateUrl: 'templates/cardsAgainst.directives.gameSettings.html'
    };
  }

  function GameSettingsController(GameService) {
    var vm = this;

    vm.settings = GameService.settings;
  }

})();
