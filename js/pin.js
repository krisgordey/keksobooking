'use strict';
(function () {
  var PIN_HEIGHT = 87;
  var PIN_WIDTH = 62;

  function createPin(ad) {
    var pin = '<button class="map__pin" style="left: ' + (ad.location.x + PIN_WIDTH / 2) + 'px; top: ' + (ad.location.y - PIN_HEIGHT) + 'px;"> <img src="' + ad.author.avatar + '" alt="' + ad.offer.title + '" width="40" height="40"> </button>';
    var template = document.createElement('div');
    template.innerHTML = pin;
    return template.querySelector('.map__pin');
  }
  window.createPin = createPin;
})();
