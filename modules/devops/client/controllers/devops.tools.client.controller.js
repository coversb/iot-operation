(function () {
  'use strict';

  angular
    .module('devops.tools')
    .controller('DevopsToolsController', DevopsToolsController);

  DevopsToolsController.$inject = ['$scope', '$state', 'Authentication', 'DevopsProt', 'Notification'];

  function DevopsToolsController($scope, $state, Authentication, DevopsProt, Notification) {

    var vm = this;

    $scope.cronExpression = '0 8 9 9 1/8 ? *';
    $scope.cronOptions = {
      hideAdvancedTab: false
    };
    $scope.isCronDisabled = false;

    var actMap = new Map([
      ['door', 4],
      ['deviceBox', 7]
    ]);

    var ctrlMap = new Map([
      ['close', 0],
      ['open', 1]
    ]);

    vm.sendDevAirConCommand = sendDevAirConCommand;
    vm.sendDevRTOCommand = sendDevRTOCommand;
    vm.sendBatchDevAirConCommand = sendBatchDevAirConCommand;

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

    function showSendRes(data, status) {
      if (status === 200) {
        Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 发送成功!'});
      } else {
        Notification.error({message: data, title: '<i class="glyphicon glyphicon-remove"></i> 发送失败!'});
      }
    }

    function sendDevAirConCommand() {
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

    function sendBatchDevAirConCommand() {
      DevopsProt.uniqueIds.forEach(function(id){
        var param = {
          uid: id,
          pwrMode: vm.devAirConPwrMode,
          workMode: vm.devAirConWorkMode,
          wind: vm.devAirConWindMode,
          interval: '60',
          duration: '60',
          temperature: vm.devAirConTemperature
        };
        DevopsProt.sendCommand('ACO', param, showSendRes);
      });
    }

    function sendDevRTOCommand(act, ctrl) {
      var param = {
        uid: vm.devUID,
        cmd: actMap.get(act).toString(10),
        subCmd: ctrlMap.get(ctrl).toString(10)
      };
      DevopsProt.sendCommand('RTO', param, showSendRes);
    }

  }
}());
