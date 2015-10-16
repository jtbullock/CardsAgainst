var stateMachine = require('state-machine');
var events = require('events');
var EVENTS = require('./EVENTS');
var _ = require('lodash');

module.exports = Game

function Game(gameConfig, opts) {
  // handle options
  var waitForPlayers = opts.waitForPlayers?opts.waitForPlayers.sort():null;
  var firstJudge = opts.firstJudge

  // Call the EventEmitter constructor
  events.EventEmitter.call(this);

  var game = this;
  var gameState = stateMachine();
  var timer;

  var judge;
  var players = []

  /**
  * starts the game
  */
  this.start = function() {
    gameState.start();
  };

  /**
  * Sets up the player to participate in this game.
  * [Can only be used during the JoinGame state]
  */
  this.playerJoin = function(playerId) {
    var correctState = (gameState.currentState() == 'JoinGame')
    var isNew = (players.indexOf(playerId) == -1)
    if( correctState && isNew ) {
      players.push(playerId);
      players.sort();
      if(_.isEqual(players, waitForPlayers)) {
        gameState.finish();
      }
    }
  };

  /**
  * Assigns a player's choice.
  * [Can only be used once during the PlayerChoose state]
  */
  this.playerChoose = function(playerId, choiceId) {

  }

  gameState
    .build()
    .state('InitialState', {
      initial: true,
      enter: initialize
    })
    .event('start', 'InitialState', 'JoinGame')
    .state('JoinGame', {
      enter: beforeJoinGame,
      leave: afterJoinGame
    })
    .event('timeout', 'JoinGame', 'PlayersChoose')
    .event('finish', 'JoinGame', 'PlayersChoose')
    .state('PlayersChoose', {
      enter: beforePlayersChoose,
      leave: afterPlayersChoose
    })

  gameState.onChange = function(toState, fromState) {
    console.log('state changed from %s to %s', fromState, toState);
  }

  // --------------------------
  // State Change Hooks

  // STATE : InitialState

  function initialize() {
    // TODO create game deck
  }

  // STATE : JoinGame

  function beforeJoinGame() {
    game.emit(EVENTS.game.start_join);
    timer = setTimeout(timeoutJoinGame, 5000)
  }

  function timeoutJoinGame() {
    gameState.timeout();
  }

  function afterJoinGame() {
    clearTimeout(timer);
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

//inherit the EventEmitter prototype
Game.prototype.__proto__ = events.EventEmitter.prototype;
