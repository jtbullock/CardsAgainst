(function() {
  angular.module('cardsAgainstApp')
    .constant('EVENTS', {
      socket: {
        player_join: 'player joined',
        player_left: 'player left',
        player_info: 'player info',
        register_player: 'register player'
      }
    });
})();
