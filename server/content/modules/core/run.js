(function() {
  "use strict";

  angular
    .module('cardsAgainstApp.game')
    .run(appStart);

  appStart.$inject = [
    "GameService"
  ];

  function appStart(GameService) {
    GameService.startListeners();
  }

})();
