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
      .otherwise({
        redirectTo: '/register'
      });
  }

  function appStart(GameService) {
    GameService.startListeners();
  }
})();
