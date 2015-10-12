var cardsAgainstApp = angular.module('cardsAgainstApp', ['ngRoute', 'btford.socket-io']);

cardsAgainstApp
    .config(config)
    .controller('RegisterCtrl', registerCtrl)
    .controller('LobbyCtrl', lobbyCtrl)
    .factory('gameSocket', gameSocketFactory)
    .factory('GameService', gameServiceFactory);

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

function registerCtrl($location, gameSocket) {
    var vm = this;

    vm.registerName = function() {
        console.log("Clicked!");
        gameSocket.emit('register player', vm.username);
        $location.url('/lobby')
    }
}

function lobbyCtrl(GameService) {
    var vm = this;

    vm.players = GameService.players;
}

function gameSocketFactory(socketFactory) {
    return socketFactory();
}

function gameServiceFactory(gameSocket) {
    var svc = {};

    svc.players = [];

    gameSocket.on('player joined', function(players) {
        angular.copy(players, svc.players);
    });

    return svc;
}