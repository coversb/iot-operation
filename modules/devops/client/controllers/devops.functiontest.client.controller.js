(function () {
  'use strict';

  angular
    .module('devops.functiontest')
    .controller('DevopsFunctionTestController', DevopsFunctionTestController);

  DevopsFunctionTestController.$inject = ['$scope', '$state', '$timeout', 'Authentication', 'DevopsProt', 'Notification'];

  function DevopsFunctionTestController($scope, $state, $timeout, Authentication, DevopsProt, Notification) {

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

    var devMediaFileMap = new Map([
      ['welcome', 0],
      ['orderOver', 1],
      ['smokeAlarm', 2]
    ]);
    var vm = this;

    vm.sendOutCommand = sendOutCommand;
    vm.sendMuoCommand = sendMuoCommand;
    vm.sendMuoVolumeCommand = sendMuoVolumeCommand;

    init();

    function init() {
      // If user is not signed in then redirect back home
      if (!Authentication.user) {
        $state.go('home');
      }

      // set default value for function
      vm.devUID = '0000000000600000'; // UID
    }

    function showSendRes(data, status) {
      if (status === 200) {
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> 发送至' + vm.devUID + '成功!' });
      } else {
        Notification.error({ message: data, title: '<i class="glyphicon glyphicon-remove"></i> 发送至' + vm.devUID + '失败!' });
      }
    }

    function sendOutCommand(pinName, value) {
      var param = {
        uid: vm.devUID,
        pin: devPinMap.get(pinName).toString(10),
        pinValue: value.toString(10),
        pinMask: '0x00000000'
      };
      DevopsProt.sendCommand('OUT', param, showSendRes);

    }

    function sendMuoCommand(mediaName) {
      var param = {
        uid: vm.devUID,
        act: '1',
        type: '1',
        vol: '0',
        mediaFname: devMediaFileMap.get(mediaName).toString(10)
      };
      DevopsProt.sendCommand('MUO', param, showSendRes);
    }

    function sendMuoVolumeCommand(act){
      var param = {
        uid: vm.devUID,
        act: act,
        type: '1',
        vol: '0',
        mediaFname: '0'
      };
      DevopsProt.sendCommand('MUO', param, showSendRes);
    }
  }
}());
