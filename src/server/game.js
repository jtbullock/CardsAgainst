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
      .state('ShowWinner', {
        enter: beforeShowWinner,
        leave: afterShowWinner
      })
      .event('start', 'Entry', 'PlayersChoose')
      .event('timeout', 'PlayersChoose', 'JudgeChoose')
      .event('finish', 'PlayersChoose', 'JudgeChoose')
      .event('timeout', 'JudgeChoose', 'ShowWinner')
      .event('finish', 'JudgeChoose', 'ShowWinner');
  });

  gameState.onChange = function(toState, fromState) {
    game.emit(EVENTS.game.change_state, toState);
    console.log('state changed from %s to %s', fromState, toState);
  };

  players.forEach(function(player) {
    player.wins = 0;
  });

  /**
  * starts the game
  */
  this.start = function() {
    game.emit(EVENTS.game.game_start, gameData());
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
      else game.emit(EVENTS.game.game_data, gameData());
    }
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
    startTimer(timeoutPlayersChoose, settings.judgeTime * 1000);
  }

  function timeoutJudgeChoose() {
    gameState.timeout();
  }

  function afterJudgeChoose() {
    clearTimeout(timer);
  }

  function beforeShowWinner() {

  }

  function timeoutShowWinner() {

  }

  function afterShowWinner() {

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
      var wasUnset = player.isJudge === undefined;
      var wasJudge = !!player.isJudge;
      player.isJudge = (player === judge);
      if(player.isJudge) game.emit(EVENTS.game.make_judge, player);
      else if(wasJudge || wasUnset) game.emit(EVENTS.game.make_player, player);

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
    game.emit(EVENTS.game.draw_cards, {
      player: player,
      cards: player.cards
    });
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
    return _.all(_.without(players, judge), 'choice');
  }
}
