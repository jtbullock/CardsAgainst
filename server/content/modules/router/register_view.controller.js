(function() {
  "use strict";

  angular
    .module('cardsAgainst.router')
    .controller('RegisterCtrl', registerCtrl);

  function registerCtrl(GameService, $location) {
    var vm = this;

    vm.registerName = function() {
      GameService.registerPlayer(vm.username);
      $location.url('/lobby')
    }
  }
})();
