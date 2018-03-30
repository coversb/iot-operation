(function () {
  'use strict';

  angular.module('core')
    .filter('doorStatus', doorStatus);

  function doorStatus() {
    return function (code) {
      var deviceDoorStatus = ["开", "关"];
      if (!Number.isInteger(code) || code > 1) {
        code = 0;
      }

      return deviceDoorStatus[code];
    };
  }
}());
