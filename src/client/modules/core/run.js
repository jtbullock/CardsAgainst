(function() {
  "use strict";

  angular
    .module('cardsAgainstApp.core')
    .run(appStart);

  appStart.$inject = [
    "GameService"
  ];

  function appStart(GameService) {
    GameService.startListeners();
  }

})();
