(function() {
  angular
    .module('cardsAgainstApp.core')
    .constant('SERVER_EVENTS', {
      player_join: 'player joined',
      player_leave: 'player left',
      player_info: 'player info'
    });

})();
