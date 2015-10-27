var stateMachine = require('state-machine');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var EVENTS = require('./EVENTS');
var GamePack = require('./gamePack');
var _ = require('lodash');

module.exports = Game;

util.inherits(Game, EventEmitter);
function Game(settings, players, firstJudge) {
  EventEmitter.call(this);

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
        enter: beforePlayersChoose,
        leave: afterPlayersChoose
      })
      .state('JudgeChoose', {
        enter: beforeJudgeChoose,
        leave: afterJudgeChoose
      })
      .event('start', 'Entry', 'PlayersChoose')
      .event('timeout', 'PlayersChoose', 'JudgeChoose')
      .event('finish', 'PlayersChoose', 'JudgeChoose');
  });

  gameState.onChange = function(toState, fromState) {
    console.log('state changed from %s to %s', fromState, toState);
  };

  players.forEach(function(player) {
    player.wins = 0;
    player.cards = [];
    drawCards(player);
  });

  /**
  * starts the game
  */
  this.start = function() {
    gameState.start();
    game.emit(EVENTS.game.game_start, gameData());
  };

  /**
  * Assigns a player's choice.
  * [Can only be used once during the PlayerChoose state]
  */
  this.playerChoose = function(player, choice) {

  };

  // --------------------------
  // State Change Hooks

  // STATE : PlayersChoose

  function beforePlayersChoose() {
    setupRound();
    startTimer(timeoutPlayersChoose, settings.gameTime * 1000);
  }

  function timeoutPlayersChoose() {
    gameState.timeout();
  }

  function afterPlayersChoose() {
    stopTimer();
  }

  function beforeJudgeChoose() {

  }

  function timeoutJudgeChoose() {

  }

  function afterJudgeChoose() {

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

    game.emit(EVENTS.game.round_start, {
      topic: topic,
      judge: judge.name
    });

    // setup each player for the round
    players.forEach(function(player) {
      if(player.isJudge) game.emit(EVENTS.game.make_player, player);
      player.isJudge = (player === judge);
      if(player.isJudge) game.emit(EVENTS.game.make_judge, player);

      player.choice = null;  // reset choice

      drawCards(player);
    });
  }

  function drawCards(player) {
    while(player.cards.length < settings.handSize) {
      var card = whiteDeck.draw();
      player.cards.push(card);
      game.emit(EVENTS.game.draw_card, {
        player: player,
        card: card
      });
    }
  }

  function startTimer(fn, duration) {
    game.emit(EVENTS.game.timer_set, Date.now() + duration);
    timer = setTimeout(fn, duration);
  }

  function stopTimer() {
    clearTimeout(timer);
  }

  function gameData() {
    return {
      settings: settings,
      wins: _(players)
        .indexBy('name')
        .mapValues('wins')
        .value()
    };
  }
}
