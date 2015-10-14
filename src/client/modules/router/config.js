(function() {
  angular
    .module('cardsAgainstApp.router')
    .config(config);

  config.$inject = [
    "$routeProvider",
    "$locationProvider"
  ];

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
})();
