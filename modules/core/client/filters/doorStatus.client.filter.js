(function () {
  'use strict';

  angular.module('core')
    .filter('doorStatus', doorStatus);

  function doorStatus() {
    return function (code) {
      var deviceDoorStatus = ['关', '开'];

      return deviceDoorStatus[code];
    };
  }
}());
