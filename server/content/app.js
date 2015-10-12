var cardsAgainstApp = angular.module('cardsAgainstApp', ['ngRoute']);

cardsAgainstApp
    .config(config)
    .controller('RegisterCtrl', registerCtrl)
    .controller('LobbyCtrl', lobbyCtrl);

function config($routeProvider, $locationProvider) {
    $routeProvider.when('/register', {
        templateUrl: 'partials/register.html',
        controller: 'RegisterCtrl as vm'
    }).
        when('/lobby', {
            templateUrl: 'partials/lobby.html',
            controller: 'LobbyCtrl as vm'
        }).
        otherwise({
            redirectTo: '/register'
        });
}

function registerCtrl($location) {
    var vm = this;

    vm.registerName = function() {
        console.log("Clicked!");
        socket.emit('register player', vm.username);
        $location.url('/lobby')
    }
}

function lobbyCtrl() {
    var vm = this;
}