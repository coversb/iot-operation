(function () {
  'use strict';

  angular
    .module('devops.tools')
    .controller('DevopsToolsController', DevopsController);

  DevopsController.$inject = ['$scope', '$state', '$http', 'Authentication', 'DevopsSettings'];

  function DevopsController($scope, $state, $http, Authentication, DevopsSettings) {

    var vm = this;

    vm.sendDevAirConCommand = sendDevAirConCommand;
    vm.sendDevOpenDoorCommand = sendDevOpenDoorCommand;
    vm.sendDevOpenDeviceBoxCommand = sendDevOpenDeviceBoxCommand;
    vm.sendDevCloseDoorCommand = sendDevCloseDoorCommand;

    init();

    function init() {
      // If user is not signed in then redirect back home
      if (!Authentication.user) {
        $state.go('home');
      }

      // set default value for air conditioner control command
      vm.devAirConPwrMode = '1';  // 空调供电常开
      vm.devAirConWorkMode = '2'; // 空调工作模式自动
      vm.devAirConWindMode = '3'; // 空调风量自动
      vm.devAirConTemperature = '20'; // 温度
      vm.devUID = '0000000000600000'; // UID
    }

    function sendCommandToBackend(data, apiURL) {
      var config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      $http.post(DevopsSettings.backboneURL + apiURL, data, config)
        .success(function (data, status, header, config) {
          console.log('success');
        })
        .error(function (data, status, header, config) {
          console.log('error');
        });
    }

    // fill '0' before string
    function assemblePadZero(str, n) {
      var temp = '0000' + str;
      return temp.substr(temp.length - n);
    }

    function assembleDevAirConMode(pwrMode, workMode, windMode) {
      var devAirConMode = '00'
        + assemblePadZero(Number(windMode).toString(2), 2)
        + assemblePadZero(Number(workMode).toString(2), 2)
        + assemblePadZero(Number(pwrMode).toString(2), 2);
      console.log(devAirConMode);
      return parseInt(devAirConMode, 2);
    }

    function sendDevAirConCommand() {
      var devAirMode = assembleDevAirConMode(vm.devAirConPwrMode, vm.devAirConWorkMode, vm.devAirConWindMode);
      var cmdObj = {};
      cmdObj.uniqueId = vm.devUID;
      cmdObj.messageType = 0x01;
      cmdObj.messageSubType = 0x06;
      cmdObj.airconCommandRequest = {
        'airConMode': devAirMode,
        'airConInterval': 60, // use default value, should be devAirConInterval
        'airConDuration': 60, // use default value, should be devAirConDuration
        'airConTemperature': parseInt(vm.devAirConTemperature, 10)
      };
      console.log('sendDevAirConCommand ' + JSON.stringify(cmdObj));

      sendCommandToBackend(cmdObj, DevopsSettings.airConditionerConAPI);
    }

    function sendDevOpenDoorCommand() {
      var cmdObj = {};
      cmdObj.uniqueId = vm.devUID;
      cmdObj.messageType = 0x01;
      cmdObj.messageSubType = 0x84;
      cmdObj.rtoCommandRequest = {
        'rtoCommand': 4,
        'rtoSubCommand': 1
      };
      console.log('sendDevOpenDoorCommand ' + JSON.stringify(cmdObj));

      sendCommandToBackend(cmdObj, DevopsSettings.rtoConAPI);
    }

    function sendDevOpenDeviceBoxCommand() {
      var cmdObj = {};
      cmdObj.uniqueId = vm.devUID;
      cmdObj.messageType = 0x01;
      cmdObj.messageSubType = 0x84;
      cmdObj.rtoCommandRequest = {
        'rtoCommand': 7,
        'rtoSubCommand': 1
      };
      console.log('sendDevOpenDeviceBoxCommand ' + JSON.stringify(cmdObj));

      sendCommandToBackend(cmdObj, DevopsSettings.rtoConAPI);
    }

    function sendDevCloseDoorCommand() {
      var cmdObj = {};
      cmdObj.uniqueId = vm.devUID;
      cmdObj.messageType = 0x01;
      cmdObj.messageSubType = 0x84;
      cmdObj.rtoCommandRequest = {
        'rtoCommand': 7,
        'rtoSubCommand': 0
      };
      console.log('sendDevCloseDoorCommand ' + JSON.stringify(cmdObj));

      sendCommandToBackend(cmdObj, DevopsSettings.rtoConAPI);
    }

  }
}());
