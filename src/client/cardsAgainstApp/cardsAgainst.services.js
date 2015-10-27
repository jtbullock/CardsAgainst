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
    draw_cards:       'draw cards',
    timer_set:        'timer set',
    change_state:     'change state',
    player_choices:   'player choices',
    round_winner:     'round winner'
  };
  var client_events = {
    register_player:  'register player',
    new_game:         'new game',
    choose_card:      'choose card',
    choose_winner:    'choose winner'
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

    svc.choosePlayerCard = function(card) {
      gameSocket.emit(client_events.choose_card, card);
    };

    svc.chooseRoundWinner = function(card) {
      gameSocket.emit(client_events.choose_winner, card);
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
        angular.extend(svc.gameData, data);
      });

      gameSocket.on(server_events.round_start, function(data) {
        console.log('received ROUND START');
        angular.extend(svc.roundData, data);
      });

      gameSocket.on(server_events.make_judge, function(data) {
        console.log('received MAKE JUDGE');
        svc.playerData.isJudge = true;
      });

      gameSocket.on(server_events.make_player, function(data) {
        console.log('received MAKE PLAYER');
        svc.playerData.isJudge = false;
      });

      gameSocket.on(server_events.draw_cards, function(cards) {
        console.log('received DRAW CARDS');
        svc.playerData.cards = cards;
      });

      gameSocket.on(server_events.timer_set, function(expires) {
        console.log('received TIMER SET');
        svc.gameData.timerExpires = expires;
      });

      gameSocket.on(server_events.change_state, function(state) {
        console.log('received CHANGE STATE');
        svc.gameData.state = state;
      });

      gameSocket.on(server_events.change_state, function(state) {
        console.log('received CHANGE STATE');
        svc.gameData.state = state;
      });

      gameSocket.on(server_events.player_choices, function(choices) {
        console.log('received PLAYER CHOICES');
        svc.roundData.playerChoices = choices;
      });

      gameSocket.on(server_events.round_winner, function(winner) {
        console.log('received ROUND WINNER');
        svc.gameData.wins[winner]++;
        svc.roundData.winner = winner;
      });
    };

    Object.keys(server_events).forEach(function(key) {
      svc.events[key] = namespace + server_events[key];
      gameSocket.forward(server_events[key]);
    });

    return svc;

  }
})();
