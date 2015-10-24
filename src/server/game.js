var stateMachine = require('state-machine');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var EVENTS = require('./EVENTS');
var _ = require('lodash');

module.exports = Game;

util.inherits(Game, EventEmitter);
function Game(settings, players, firstJudge) {
  EventEmitter.call(this);

  var game = this;
  var gameState = stateMachine();
  var timer;

  var judge;

  /**
  * starts the game
  */
  this.start = function() {
    gameState.start();
  };

  /**
  * Assigns a player's choice.
  * [Can only be used once during the PlayerChoose state]
  */
  this.playerChoose = function(player, choice) {

  };

  gameState
    .build()
    .state('InitialState', {
      initial: true,
      leave: initialize
    })
    .event('start', 'InitialState', 'PlayersChoose')
    .state('PlayersChoose', {
      enter: beforePlayersChoose,
      leave: afterPlayersChoose
    });

  gameState.onChange = function(toState, fromState) {
    console.log('state changed from %s to %s', fromState, toState);
  };

  // --------------------------
  // State Change Hooks

  // STATE : InitialState

  function initialize() {
    game.emit(EVENTS.game.game_start);
    // TODO create game deck
  }

  // STATE : PlayersChoose

  function beforePlayersChoose() {
    // select a judge for the round
    if(!judge) judge = getFirstJudge();
    else judge = nextJudge();
    game.emit(EVENTS.game.new_judge, judge);

    // TODO choose a black card

    // TODO fill player`s' hands
  }

  function afterPlayersChoose() {

  }

  function timeoutPlayersChoose() {

  }

  // ----------------------
  // Other Private Methods

  function getFirstJudge() {
    return firstJudge || players[0];
  }

  function getNextJudge() {
    var lastIndex = _.indexOf(players,judge);
    var nextIndex = (lastIndex + 1) % players.length;
    return players[nextIndex];
  }

}
