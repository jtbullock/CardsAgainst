(function() {
  angular
    .module('cardsAgainstApp.game')
    .controller('GameController', GameController);

  GameController.$inject = [
    "GameService"
  ];

  function GameController(GameService) {
    var vm = this;

    vm.players = [];

    GameService.whenPlayerInfo(function(id, username, host) {
      vm.id = id;
      vm.username = username;
      vm.host = host;
    });

    GameService.whenPlayerJoin(function(player, playerList) {
      vm.players = playerList;
    });

    GameService.whenPlayerLeave(function(player, playerList) {
      vm.players = playerList;
    });

    vm.registerName = function(username) {
      GameService.registerPlayer(username);
    };

  }
})();
