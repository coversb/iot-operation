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
      ['emeLight', 14],
      ['outdoorLEDSwitch', 16],
      ['advMachine1', 17],
      ['advMachine2', 18]
    ]);

    var devMediaFileMap = new Map([
      ['welcome', 0],
      ['orderOver', 1],
      ['smokeAlarm', 2],
      ['bgm', 3],
      ['badPeople', 4],
      ['takeUnpaid', 5],
      ['forbiddenPeople', 6],
      ['unpaid', 7]
    ]);
    var vm = this;

    vm.sendOutCommand = sendOutCommand;
    vm.sendMuoCommand = sendMuoCommand;
    vm.sendMuoVolumeCommand = sendMuoVolumeCommand;
    vm.sendOuoCommand = sendOuoCommand;

    var now = new Date();
    vm.order = {
      type: '0',
      orderID: '1',
      startYear: now.getFullYear().toString(),
      startMonth: (now.getMonth() + 1).toString(),
      startDay: now.getDate().toString(),
      startHour: now.getHours().toString(),
      startMinute: '00',
      startSecond: '00',
      expireYear: now.getFullYear().toString(),
      expireMonth: (now.getMonth() + 1).toString(),
      expireDay: now.getDate().toString(),
      expireHour: now.getHours().toString(),
      expireMinute: '59',
      expireSecond: '00',
      password: '1234'
    };

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

    function sendMuoVolumeCommand(act) {
      var param = {
        uid: vm.devUID,
        act: act,
        type: '1',
        vol: '0',
        mediaFname: '0'
      };
      DevopsProt.sendCommand('MUO', param, showSendRes);
    }

    function sendOuoCommand() {
      var startTimestamp = new Date(vm.order.startYear, vm.order.startMonth - 1, vm.order.startDay,
        vm.order.startHour, vm.order.startMinute, vm.order.startSecond);
      var expireTimestamp = new Date(vm.order.expireYear, vm.order.expireMonth - 1, vm.order.expireDay,
        vm.order.expireHour, vm.order.expireMinute, vm.order.expireSecond);
      var param = {
        uid: vm.devUID,
        type: vm.order.type,
        orderID: vm.order.orderID,
        orderStart: (startTimestamp.getTime() / 1000).toString(10),
        orderExpire: (expireTimestamp.getTime() / 1000).toString(10),
        orderPassword: vm.order.password,
        orderPersonNumber: '1',
        orderPasswordValidConut: '1'
      };
      DevopsProt.sendCommand('OUO', param, showSendRes);
    }
  }
}());
