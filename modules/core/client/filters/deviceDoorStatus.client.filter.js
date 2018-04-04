(function () {
  'use strict';

  angular.module('core')
    .filter('deviceDoorStatus', deviceDoorStatus);

  function deviceDoorStatus() {
    return function (code) {
      var deviceDoorStatus = ["开", "关"];

      return deviceDoorStatus[code];
    };
  }
}());
