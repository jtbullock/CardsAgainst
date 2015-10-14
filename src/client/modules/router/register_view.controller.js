(function() {
  angular
    .module('cardsAgainstApp.router')
    .controller('RegisterCtrl', registerCtrl);

  registerCtrl.$inject = [
    "GameService",
    "$location"
  ];

  function registerCtrl(GameService, $location) {
    var vm = this;

    vm.registerName = function() {
      GameService.registerPlayer(vm.username);
      $location.url('/lobby');
    };
  }
})();
