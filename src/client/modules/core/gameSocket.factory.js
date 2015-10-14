(function() {
  angular
    .module('cardsAgainstApp.core')
    .factory('gameSocket', gameSocketFactory);

  gameSocketFactory.$inject = [
    "socketFactory"
  ];

  function gameSocketFactory(socketFactory) {
    return socketFactory();
  }

})();
