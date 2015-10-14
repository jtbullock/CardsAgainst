(function() {
  angular
    .module('cardsAgainstApp.core')
    .factory('gameSocket', gameSocketFactory);

  gameServiceFactory.$inject = [
    "socketFactory"
  ];

  function gameSocketFactory(socketFactory) {
    return socketFactory();
  }

})();
