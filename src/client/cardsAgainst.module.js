(function() {
  angular
    .module('cardsAgainstApp', ['ngRoute', 'btford.socket-io'])
    .config(config)
    .run(appStart);

  function config($routeProvider, $locationProvider) {
    $routeProvider
      .when('/register', {
        templateUrl: 'templates/register.html',
        controller: 'RegisterCtrl as vm'
      })
      .when('/lobby', {
        templateUrl: 'templates/lobby.html',
        controller: 'LobbyCtrl as vm'
      })
      .when('/game', {
        templateUrl: 'templates/game.html',
        controller: 'GameCtrl as vm'
      })
      .otherwise({
        redirectTo: '/register'
      });
  }

  function appStart($location, $rootScope, GameService) {
    GameService.startListeners();
    $rootScope.$on(GameService.events.game_start, function() {
      $location.url('/game');
    });
    $rootScope.$on(GameService.events.register_success, function() {
      $location.url('/lobby');
    });
  }
})();
