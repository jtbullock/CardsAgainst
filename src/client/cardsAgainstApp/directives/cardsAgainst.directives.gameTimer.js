(function() {

  angular
    .module('cardsAgainstApp')
    .directive('gameTimer', gameTimer)
    .controller('GameTimerController', GameTimerController);

  function gameTimer() {
    return {
      restrict: 'A',
      controller: 'GameTimerController',
      controllerAs: 'vm',
      bindToController: true,
      scope: {
        endTime: '@'
      },
      templateUrl: 'templates/cardsAgainst.directives.gameTimer.html',
      link: function(scope, element, attributes) {
        attributes.$observe('endTime', scope.vm.setTimer);
      }
    };
  }

  function GameTimerController($interval) {
    var vm = this;
    vm.remaining = 0;
    var timer;

    this.setTimer = function(expires) {
      var remaining = expires - Date.now();
      if(timer) $interval.cancel(timer);
      if(remaining > 0) vm.remaining = remaining;
      timer = $interval(tick, 100);

      function tick() {
        var remaining = expires - Date.now();
        if(remaining <= 0) {
          $interval.cancel(timer);
          timer = null;
        }
        else vm.remaining = remaining;
      }
    };
  }

})();
