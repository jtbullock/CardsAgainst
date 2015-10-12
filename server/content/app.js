var cardsAgainstApp = angular.module('cardsAgainstApp', ['ngRoute']);

cardsAgainstApp.controller('RegisterCtrl', function() {});

cardsAgainstApp.controller('LobbyCtrl', function() {});

cardsAgainstApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/register', {
        templateUrl: 'partials/register.html',
        controller: 'RegisterCtrl'
    }).
        when('/lobby', {
            templateUrl: 'partials/lobby.html',
            controller: 'LobbyCtrl'
        }).
        otherwise({
            redirectTo: '/register'
        });
}]);