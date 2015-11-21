var _ = require('lodash');

module.exports = {
  generateBlackDeck: function() {
    var deck = _()
      .range(100)
      .map(function(n) {
        return {
          id: _.random(10)*100+n,
          body: 'Black Card '+(n+1)
        };
      })
      .shuffle()
      .value();
    return {
      drawMany: function(n) {
        return deck.splice(0,n);
      },
      draw: function() {
        return deck.shift();
      }
    };
  },
  generateWhiteDeck: function() {
    var deck = _()
      .range(100)
      .map(function(n) {
        return {
          id: _.random(10)*100+n,
          body: 'White Card '+(n+1)
        };
      })
      .shuffle()
      .value();
    return {
      drawMany: function(n) {
        return deck.splice(0,n);
      },
      draw: function() {
        return deck.shift();
      }
    };
  }
};
