var _ = require('lodash');

module.exports = Player;

// Add events directly onto the constructor
_.extend(Player, {
  register_player:  'register player',
  new_game:         'new game',
  choose_card:      'choose card',
  choose_winner:    'choose winner'
});

function Player(socket, name, options) {
  var player = this;

  player.id = options.id;
  player.active = options.active || true;
  player.score = options.score || 0;
  player.name = name;
  player.socket = socket;

  player.getPublicData = function () {
    return _.pick(player, 'name', 'score');
  };

  player.getData = function () {
    return _.omit(player,'socket');
  };
}
