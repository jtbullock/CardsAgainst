var cardsAgainstApp = angular.module('cardsAgainstApp', ['ngRoute']);

cardsAgainstApp
    .config(config)
    .controller('RegisterCtrl', registerCtrl)
    .controller('LobbyCtrl', lobbyCtrl);

function config($routeProvider, $locationProvider) {
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
}

function registerCtrl() {
    var vm = this;
}

function lobbyCtrl() {
    var vm = this;
}