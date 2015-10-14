(function() {
  angular
    .module('cardsAgainstApp', [
      'cardsAgainstApp.core',
      'cardsAgainstApp.game'
    ]);

  angular
    .module('cardsAgainstApp.game', [
      'cardsAgainstApp.core'
    ]);

  angular
    .module('cardsAgainstApp.core', [
      'btford.socket-io'
    ]);

})();
