
'use strict';
(function () {
  var ENTER_KEY_CODE = 13;
  var PINS_LIMIT = 5;
  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_HEIGHT = 65;
  var BASE_ADDRESS = {
    x: Math.floor(570 + MAIN_PIN_WIDTH / 2),
    y: 375 + MAIN_PIN_HEIGHT
  };
  var DRAG_LOCATION = {
    xMin: 65,
    xMax: 1200,
    yMin: 150,
    yMax: 500
  };
  var successBlock = document.querySelector('.success');
  var map = document.querySelector('.map');
  var mainPin = document.querySelector('.map__pin--main');


  function deletePins() {
    var buttonPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < buttonPins.length; i++) {
      var buttonPin = buttonPins[i];
      if (buttonPin) {
        buttonPin.remove();
      }
    }
  }

  function addPins(ads) {
    var pinsContainer = document.createDocumentFragment();
    for (var i = 0; i < ads.length; i++) {
      var pin = window.createPin(ads[i]);
      setPinListener(pin, ads[i]);
      pinsContainer.appendChild(pin);
    }
    map.appendChild(pinsContainer);
  }

  function onMainPinPressEnter(evt) {
    if (evt.keyCode === ENTER_KEY_CODE) {
      onMainPinMouseUp();
      mainPin.removeEventListener('keydown', onMainPinPressEnter);
    }
  }

  function onMainPinMouseUp() {
    window.backend.getData(function (data) {
      map.classList.remove('map--faded');
      addPins(data.slice(0, PINS_LIMIT));
      window.form.enable();
      window.filter.setup(data, function (ads) {
        window.card.remove();
        deletePins();
        window.debounce(addPins(ads));
      });
      mainPin.removeEventListener('mouseup', onMainPinMouseUp);
      mainPin.removeEventListener('keydown', onMainPinPressEnter);
    }, window.showErrorMessage);
  }

  function setPinListener(pin, offer) {
    pin.addEventListener('click', function () {
      window.card.remove();
      window.card.add(offer, map);
    });
  }

  function onClickRemove() {
    map.classList.add('map--faded');
    window.form.disable();
    window.form.setAddress(BASE_ADDRESS.x, BASE_ADDRESS.y);
    window.card.remove();
    deletePins();
    mainPin.style.left = BASE_ADDRESS.x + 'px';
    mainPin.style.top = BASE_ADDRESS.y + 'px';
    mainPin.addEventListener('click', onMainPinMouseUp);
  }

  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      var newY = mainPin.offsetTop - shift.y;
      var newX = mainPin.offsetLeft - shift.x;
      if (newY >= DRAG_LOCATION.yMin - mainPin.offsetHeight && newY <= DRAG_LOCATION.yMax - mainPin.offsetHeight
      && newX >= DRAG_LOCATION.xMin - mainPin.offsetWidth && newX <= DRAG_LOCATION.xMax - mainPin.offsetWidth) {
        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };
        mainPin.style.top = mainPin.offsetTop - shift.y + 'px';
        mainPin.style.left = mainPin.offsetLeft - shift.x + 'px';

        window.form.setAddress(Math.floor(newX + MAIN_PIN_WIDTH / 2), newY + MAIN_PIN_HEIGHT);
      }

    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  function onSuccessSumbit(evt) {
    window.backend.sendData(new FormData(evt.target), function () {
      onClickRemove();
      successBlock.classList.remove('hidden');
      successBlock.addEventListener('click', function () {
        successBlock.classList.add('hidden');
      });

    }, window.showErrorMessage);
    evt.preventDefault();
  }

  window.form.disable();
  mainPin.addEventListener('mouseup', onMainPinMouseUp);
  mainPin.addEventListener('keydown', onMainPinPressEnter);

  window.form.setResetListener(onClickRemove);
  window.form.setSumbitListener(onSuccessSumbit);
  window.form.setAddress(BASE_ADDRESS.x, BASE_ADDRESS.y);

})();
