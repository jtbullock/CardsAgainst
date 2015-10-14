(function() {
  "use strict";

  angular
    .module('cardsAgainstApp', [
      'cardsAgainstApp.router',
      'cardsAgainstApp.core',
      'cardsAgainstApp.game'
    ]);

  angular
    .module('cardsAgainstApp.router', [
      'ngRoute'
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
