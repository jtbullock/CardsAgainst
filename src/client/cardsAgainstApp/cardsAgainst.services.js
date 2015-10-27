(function() {
  angular.module('cardsAgainstApp')
    .factory('GameService', gameServiceFactory);

  var server_events = {
    player_join:      'player joined',
    player_left:      'player left',
    register_success: 'register success',
    game_start:       'game start',
    round_start:      'round start',
    make_player:      'make player',
    make_judge:       'make judge',
    draw_card:        'draw card',
    timer_set:        'timer set'
  };
  var client_events = {
    register_player:  'register player',
    new_game:         'new game'
  };
  var namespace =     'gamesocket:';

  function gameServiceFactory(socketFactory) {
    var svc = {};
    var gameSocket = socketFactory({
      prefix: namespace
    });

    svc.events = {};

    svc.players = [];

    //default game settings
    svc.settings = {
      gameTime: 60,
      judgeTime: 30,
      winningPoints: 10
    };

    svc.playerData = {};
    svc.roundData = {};
    svc.gameData = {};

    svc.registerPlayer = function(playerName) {
      gameSocket.emit(client_events.register_player, playerName);
    };

    svc.newGame = function() {
      gameSocket.emit(client_events.new_game, svc.settings);
    };

    svc.startListeners = function() {
      gameSocket.on(server_events.player_join, function(players) {
        console.log('received PLAYER JOIN');
        angular.copy(players, svc.players);
      });

      gameSocket.on(server_events.player_left, function(players) {
        console.log('received PLAYER LEFT');
        angular.copy(players, svc.players);
      });

      gameSocket.on(server_events.register_success, function(data) {
        console.log('received REGISTER SUCCESS');
        angular.extend(svc.playerData, data);
      });

      gameSocket.on(server_events.game_start, function(data) {
        console.log('received GAME START');
        angular.copy(data, svc.gameData);
      });

      gameSocket.on(server_events.round_start, function(data) {
        console.log('received ROUND START');
        angular.copy(data, svc.roundData);
      });

      gameSocket.on(server_events.make_judge, function(data) {
        console.log('received MAKE JUDGE');
        svc.playerData.isJudge = true;
      });

      gameSocket.on(server_events.make_player, function(data) {
        console.log('received MAKE PLAYER');
        svc.playerData.isJudge = false;
      });

      gameSocket.on(server_events.draw_card, function(card) {
        console.log('received DRAW CARD');
        svc.playerData.cards.push(card);
      });

      gameSocket.on(server_events.timer_set, function(expires) {
        console.log('received TIMER SET');
        console.log(expires);
        svc.gameData.timerExpires = expires;
      });
    };

    Object.keys(server_events).forEach(function(key) {
      svc.events[key] = namespace + server_events[key];
      gameSocket.forward(server_events[key]);
    });

    return svc;

  }
})();
