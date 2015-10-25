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
    console.log('state changed from %s to %s', fromState, toState);
  };

  players.forEach(function(player) {
    player.wins = 0;
    player.cards = whiteDeck.drawMany(settings.handSize);
  });

  /**
  * starts the game
  */
  this.start = function() {
    gameState.start();
    game.emit(EVENTS.game.game_start);
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
    setupNextRound();

    game.emit(EVENTS.game.game_data, gameData());
    players.forEach(function(player) {
      game.emit(EVENTS.game.player_data, player);
    });

    var stateTimeout = settings.gameTime * 1000;
    game.emit(EVENTS.game.timer_set, Date.now() + stateTimeout);
    timer = setTimeout(timeoutPlayersChoose, stateTimeout);
  }

  function timeoutPlayersChoose() {
    gameState.timeout();
  }

  function afterPlayersChoose() {
    clearTimeout(timer);
  }

  function beforeJudgeChoose() {
    game.emit(EVENTS.game.game_data, gameData());

    var stateTimeout = settings.judgeTime * 1000;
    game.emit(EVENTS.game.timer_set, Date.now() + stateTimeout);
    timer = setTimeout(timeoutJudgeChoose, stateTimeout);
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

  function setupNextRound () {
    // choose the next judge
    if(!judge) judge = firstJudge;
    else {
      var lastIndex = _.findIndex(players, judge);
      var nextIndex = (lastIndex + 1) % players.length;
      judge = players[nextIndex];
    }

    // choose next topic
    topic = blackDeck.draw();

    // setup each player for the round
    players.forEach(function(player) {
      while(player.cards.length < settings.handSize) {
        player.cards.push(whiteDeck.draw());
      }
      player.choice = null;  // reset choice
      player.isJudge = (player === judge);
    });
  }

  function gameData() {
    return {
      round: {
        state: gameState.currentState(),
        topic: topic,
        judge: judge.name
      },
      players: _(players)
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
