(function () {
  'use strict';

  angular
    .module('devops.functiontest')
    .controller('DevopsFunctionTestController', DevopsFunctionTestController);

  DevopsFunctionTestController.$inject = ['$scope', '$state', '$http', '$timeout', 'Authentication', 'DevopsSettings'];

  function DevopsFunctionTestController($scope, $state, $http, $timeout, Authentication, DevopsSettings) {

    var devPinMap = new Map([
      ['exhaust', 5],
      ['airCon1', 6],
      ['airCon2', 7],
      ['groundPlug1', 8],
      ['groundPlug2', 9],
      ['light', 10],
      ['indoorTv', 11],
      ['freshAir', 12],
      ['vendingMachine', 13],
      ['emeLight', 14]
    ]);
    var vm = this;

    vm.sendOutCommand = sendOutCommand;

    init();

    function init() {
      // If user is not signed in then redirect back home
      if (!Authentication.user) {
        $state.go('home');
      }

      // set default value for function
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

          vm.successMessage = '发送至' + vm.devUID + '成功';
        })
        .error(function (data, status, header, config) {
          console.log('error');
          vm.successMessage = '发送至' + vm.devUID + '失败';
        });

      vm.successMessagebool = true;
      $timeout(function () {
        vm.successMessagebool = false;
      }, 3000);
    }

    function sendOutCommand(pinName, value) {
      var cmdObj = {};
      cmdObj.uniqueId = vm.devUID;
      cmdObj.messageType = 0x01;
      cmdObj.messageSubType = 0x82;
      cmdObj.outputConfigCommandRequest = {
        'outputNumber': devPinMap.get(pinName),
        'outputPin': value,
        'controlMask': 0x00000000
      };
      sendCommandToBackend(cmdObj, DevopsSettings.outConAPI);
    }
  }
}());
