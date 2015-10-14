(function() {
  angular
    .module('cardsAgainstApp.core')
    .service('GameService', GameService);

  GameService.$inject = [
    "socketFactory",
    "SERVER_EVENTS",
    "CLIENT_EVENTS"
  ];

  function GameService(socketFactory, SERVER_EVENTS, CLIENT_EVENTS) {
    var sf = socketFactory();

    this.registerPlayer = function(playerName) {
      sf.emit(CLIENT_EVENTS.register_player, playerName);
    };

    this.whenPlayerJoin = function(method) {
      sf.on(SERVER_EVENTS.player_join, function(data) {
        var name = angular.copy(data.name);
        var players = angular.copy(data.players);
        method(name, players);
      });
    };

    this.whenPlayerLeave = function(method) {
      sf.on(SERVER_EVENTS.player_leave, function(data) {
        var name = angular.copy(data.name);
        var players = angular.copy(data.players);
        method(name, players);
      });
    };

    this.whenPlayerInfo = function(method) {
      sf.on(SERVER_EVENTS.player_info, function(data) {
        var id = angular.copy(data.id);
        var name = angular.copy(data.name);
        var host = angular.copy(data.host);
        method(id, name, host);
      });
    };
  }

})();
