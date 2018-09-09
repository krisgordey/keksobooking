'use strict';

(function () {
  function showErrorMessage(errorMessage) {
    var errorBlock = document.createElement('div');

    errorBlock.classList.add('error-message');
    errorBlock.textContent = errorMessage;

    document.body.appendChild(errorBlock);
  }

  window.showErrorMessage = showErrorMessage;
})();
