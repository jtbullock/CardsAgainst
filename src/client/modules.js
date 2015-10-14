(function() {
  "use strict";

  angular
    .module('cardsAgainstApp', [
      'cardsAgainst.router',
      'cardsAgainst.core',
      'cardsAgainst.game'
    ]);

  angular
    .module('cardsAgainst.router', [
      'ngRoute'
    ]);

  angular
    .module('cardsAgainst.game', [
      'cardsAgainst.core'
    ]);

  angular
    .module('cardsAgainstApp.core', [
       'btford.socket-io'
     ]);

})();
