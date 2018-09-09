
'use strict';
(function () {
  var PRICE_FILTER = {
    low: {
      min: 0,
      max: 10000
    },
    middle: {
      min: 10000,
      max: 50000
    },
    high: {
      min: 50000,
      max: Infinity
    }
  };
  var ENTER_KEY_CODE = 13;
  var MAX_NUMBER_OF_PINS = 5;
  var filterForm = document.querySelector('.map__filters');
  var filterSelects = filterForm.querySelectorAll('select');
  var filterCheckboxes = filterForm.querySelectorAll('input');
  var ads = null;
  var func = null;

  function onChange() {
    function debounceFunc() {
      var filteredAds = getFilteredAds();
      func(filteredAds);
    }
    window.debounce(debounceFunc);
  }

  function getFilteredAds() {
    var filteringObject = getFilteringObject();
    var filteringFeatures = filteringObject.features;
    var filteringSettingsObject = filteringObject.settings;
    var filteringSettings = Object.keys(filteringObject.settings);
    var filteredAds = ads.filter(function (ad) {
      var adsFeatures = ad.offer.features;

      var hasAllFeatures = filteringFeatures.every(function (feature) {
        return adsFeatures.includes(feature);
      });

      var hasConformityOfSettings = filteringSettings.every(function (option) {
        if (option === 'housing-price') {
          var maxPrice = PRICE_FILTER[filteringSettingsObject['housing-price']].max;
          var minPrice = PRICE_FILTER[filteringSettingsObject['housing-price']].min;
          return ad.offer.price < maxPrice && ad.offer.price > minPrice;
        }
        var property = option.split('-')[1];
        return ad.offer[property].toString() === filteringSettingsObject[option];
      });
      return hasAllFeatures && hasConformityOfSettings;
    });
    return filteredAds.length > MAX_NUMBER_OF_PINS ? filteredAds.slice(0, MAX_NUMBER_OF_PINS) : filteredAds;
  }

  function getFilteringObject() {
    var features = [];
    var settings = {};

    filterSelects.forEach(function (select) {
      if (select.value !== 'any') {
        var filterName = select.name;
        settings[filterName] = select.value;
      }
    });
    filterCheckboxes.forEach(function (checkbox) {
      if (checkbox.checked) {
        features.push(checkbox.value);
      }
    });

    return {
      features: features,
      settings: settings
    };
  }

  filterSelects.forEach(function (filterSelect) {
    filterSelect.addEventListener('change', onChange);
  });

  filterCheckboxes.forEach(function (filterCheckbox) {
    filterCheckbox.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ENTER_KEY_CODE) {
        filterCheckbox.checked = filterCheckbox.checked ? false : true;
        var dispatchedEvent = new Event('change');
        filterCheckbox.dispatchEvent(dispatchedEvent);
      }
    });
    filterCheckbox.addEventListener('change', onChange);
  });

  function setup(data, callback) {
    ads = data;
    func = callback;
  }

  window.filter = {
    setup: setup
  };
})();
