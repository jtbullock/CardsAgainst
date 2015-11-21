var stateMachine = require('state-machine');
var _ = require('lodash');

var GamePack = require('./gamePack');
var Player = require('./player');

module.exports = Game;

// Add events directly onto the constructor
_.extend(Game, {
  game_start:       'game start',
  round_start:      'round start',
  make_player:      'make player',
  make_judge:       'make judge',
  draw_cards:       'draw cards',
  timer_set:        'timer set',
  change_state:     'change state',
  player_choices:   'player choices',
  round_winner:     'round winner'
});

function Game(settings, nsp, players, firstJudge) {

  var game = this;
  var blackDeck = GamePack.generateBlackDeck();
  var whiteDeck = GamePack.generateWhiteDeck();
  var timer;
  var judge;

  _.defaults(settings, {
    handSize: 7,
    gameTime: 60,
    judgeTime: 30,
    winningPoints: 10
  });

  var gameState = stateMachine(function (builder) {
    builder
      .state('Entry', {
        initial: true
      })
      .state('PlayersChoose', {
        enter: playersChoose,
      })
      .state('JudgeChoose', {
        enter: judgeChoose
      })
      .state('ShowWinner', {
        enter: showWinner
      })
      .state('Exit', {})
      .event('start', 'Entry', 'PlayersChoose')
      .event('timeout', 'PlayersChoose', 'JudgeChoose')
      .event('finish', 'PlayersChoose', 'JudgeChoose')
      .event('timeout', 'JudgeChoose', 'ShowWinner')
      .event('finish', 'JudgeChoose', 'ShowWinner')
      .event('repeat', 'ShowWinner', 'PlayersChoose')
      .event('finish', 'ShowWinner', 'Exit');
  });

  gameState.onChange = function(toState, fromState) {
    nsp.emit(Game.change_state, toState);
    console.log('state changed from %s to %s', fromState, toState);
  };

  /**
  * starts the game
  */
  this.start = function() {
    initialize();
    nsp.emit(Game.game_start, gameData());
    gameState.start();
  };

  /**
  * Assigns a player's choice.
  * [Can only be used once during the PlayerChoose state]
  */
  this.chooseCard = function(player, card) {
    if(_.find(player.cards, card)) {
      player.choice = card;
      if(allPlayersChosen()) {
        gameState.finish();
      }
      else nsp.emit(Game.game_data, gameData());
    }
  };

  this.chooseWinner = function(player, card) {
    if(player.isJudge) {
      var winner = _.find(players, {choice: card});
      nsp.emit(Game.round_winner, winner.name);
      gameState.finish();
    }
  };

  // --------------------------
  // State Change Hooks

  function initialize() {
    players.forEach(function(player) {
      player.wins = 0;
      player.socket.on(Player.choose_card, function(card) {
        game.chooseCard(player, card);
      });
      player.socket.on(Player.choose_winner, function(winningCard) {
        game.chooseWinner(player, winningCard);
      });
    });
  }
  // STATE : PlayersChoose

  function playersChoose() {
    console.log('Players Choose');
    setupRound();
    startTimer(gameState.timeout, settings.gameTime * 1000);
  }

  function judgeChoose() {
    console.log('Judge Choose');
    startTimer(gameState.timeout, settings.judgeTime * 1000);
    judge.socket.emit(Game.player_choices, playerChoices());
  }

  function showWinner() {
    console.log('Show Winner');
    startTimer(function() {
      var gameWinner = _.find(players, {wins: settings.winningPoints});
      if(gameWinner) gameState.finish();
      else gameState.repeat();
    }, 10000);
  }

  // ----------------------
  // Other Private Methods

  function setupRound () {
    // choose the next judge
    if(!judge) judge = firstJudge;
    else {
      var lastIndex = _.findIndex(players, judge);
      var nextIndex = (lastIndex + 1) % players.length;
      judge = players[nextIndex];
    }

    // choose next topic
    topic = blackDeck.draw();

    nsp.emit(Game.round_start, roundData());

    // setup each player for the round
    players.forEach(function(player) {
      var wasUnset = player.isJudge === undefined;
      var wasJudge = !!player.isJudge;

      player.isJudge = (player === judge);

      if(player.isJudge) {
        player.socket.emit(Game.make_judge, player.getData());
      }
      else if(wasJudge || wasUnset) {
        player.socket.emit(Game.make_player, player.getData());
      }

      if(!player.isJudge) drawCards(player);

      player.choice = null;  // reset choice
    });
  }

  function drawCards(player) {
    if(!player.cards) player.cards = [];
    while(player.cards.length < settings.handSize) {
      var card = whiteDeck.draw();
      player.cards.push(card);
    }
    player.socket.emit(Game.draw_cards, player.cards);
  }

  function startTimer(fn, duration) {
    clearTimeout(timer);
    nsp.emit(Game.timer_set, Date.now() + duration);
    timer = setTimeout(fn, duration);
  }

  function roundData() {
    return {
      topic: topic,
      judge: judge.name
    };
  }

  function gameData() {
    return {
      settings: settings,
      wins: _(players)
        .indexBy('name')
        .mapValues(function(player) {
          return {
            wins: player.wins,
            done: (!player.isJudge && player.choice !== null)
          };
        })
        .value()
    };
  }

  function allPlayersChosen() {
    return _(players).without(judge).all('choice');
  }

  function playerChoices() {
    return _(players).map('choice').compact().value();
  }
}
