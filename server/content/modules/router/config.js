(function() {
  "use strict";

  angular
    .module('cardsAgainst.router')
    .config(config)

  config.$inject = [
    "$routeProvider",
    "$locationProvider"
  ];

  function config($routeProvider, $locationProvider) {
    $routeProvider
      .when('/register', {
        templateUrl: 'partials/register.html',
        controller: 'RegisterCtrl as vm'
      })
      .when('/lobby', {
        templateUrl: 'partials/lobby.html',
        controller: 'LobbyCtrl as vm'
      })
      .otherwise({
        redirectTo: '/register'
      });
  }
})();
