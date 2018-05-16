(function () {
  'use strict';

  angular
    .module('devops.tools')
    .controller('DevopsToolsController', DevopsToolsController);

  DevopsToolsController.$inject = ['$window', '$http', '$scope', '$state', 'Authentication', 'DevopsSettings', 'DevopsProt', 'Notification'];

  function DevopsToolsController($window, $http, $scope, $state, Authentication, DevopsSettings, DevopsProt, Notification) {

    var vm = this;

    var actMap = new Map([
      ['door', 4],
      ['deviceBox', 7]
    ]);

    var ctrlMap = new Map([
      ['close', 0],
      ['open', 1]
    ]);

    vm.availableBoxMap = new Map();
    vm.sendDevAirConCommand = sendDevAirConCommand;
    vm.sendDevRTOCommand = sendDevRTOCommand;

    init();
    updateAvailableUID();

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

    function showSendRes(data, status) {
      if (status === 200) {
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> 发送成功!' });
      } else {
        Notification.error({ message: data, title: '<i class="glyphicon glyphicon-remove"></i> 发送失败!' });
      }
    }

    function updateAvailableUID() {
      var config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      var data = {
        'pageNum': 1,
        'pageSize': 1024
      };
      $http.post(DevopsSettings.backboneURL + DevopsSettings.boxListAPI, data, config)
        .success(function (data) {
          if (Array.isArray(data.data)) {
            vm.availableBoxMap.clear();
            for (var idx = 0; idx < data.data.length; ++idx) {
              vm.availableBoxMap[data.data[idx].base.uniqueId] = data.data[idx].base.name;
            }
          }
        })
        .error(function (e, status) {
          console.log('Error:' + e + ',' + status);
        });
    }

    function sendCommandConfirm(text) {
      var boxName = vm.availableBoxMap[vm.devUID];
      if (boxName === undefined) {
        boxName = '未知场馆';
      }
      boxName += '(' + vm.devUID + ')';
      return $window.confirm('确定向"' + boxName + '"发送？\n' + text);
    }

    function sendDevAirConCommand() {
      var confText = '供电：' + $('#devAirConPwrMode option:selected').text() + '\n'
        + '模式：' + $('#devAirConWorkMode option:selected').text() + '\n'
        + '风力：' + $('#devAirConWindMode option:selected').text() + '\n'
        + '温度：' + $('#devAirConTemperature option:selected').text() + '\n';
      if (sendCommandConfirm(confText) === false) {
        return;
      }
      var param = {
        uid: vm.devUID,
        pwrMode: vm.devAirConPwrMode,
        workMode: vm.devAirConWorkMode,
        wind: vm.devAirConWindMode,
        interval: '60',
        duration: '60',
        temperature: vm.devAirConTemperature
      };
      DevopsProt.sendCommand('ACO', param, showSendRes);
    }

    function sendDevRTOCommand(act, ctrl) {
      var confText = '';
      if (act === 'door') {
        confText = '开盒门';
      } else if (act === 'deviceBox') {
        if (ctrl === 'open') {
          confText = '开设备箱';
        } else if (ctrl === 'close') {
          confText = '关设备箱';
        }
      }

      if (sendCommandConfirm(confText) === false) {
        return;
      }
      var param = {
        uid: vm.devUID,
        cmd: actMap.get(act).toString(10),
        subCmd: ctrlMap.get(ctrl).toString(10)
      };
      DevopsProt.sendCommand('RTO', param, showSendRes);
    }

  }
}());
