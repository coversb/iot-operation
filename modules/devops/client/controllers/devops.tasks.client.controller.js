(function () {
  'use strict';

  angular
    .module('devops.tasks')
    .controller('DevopsTasksController', DevopsTasksController);

  DevopsTasksController.$inject = ['$scope', '$state', 'Authentication', 'DevopsProt', 'DevopsTasks', 'Notification'];

  function DevopsTasksController($scope, $state, Authentication, DevopsProt, DevopsTasks, Notification) {

    var vm = this;

    $scope.cronExpression = '0 0 * * *';

    $scope.cronOptions = {
      options: {
      }
    };

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
    vm.addBatchAirConTasks = addBatchAirConTasks;

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

    function addBatchAirConTasks() {
      var param = {
        jobName: "airCon",
        jobSchedule: "",
        jobRepeatEvery: $scope.cronExpression,
        jobData: {
          devAirConPwrMode:  vm.devAirConPwrMode, // 空调供电常开
          devAirConWorkMode: vm.devAirConWorkMode, // 空调工作模式自动
          devAirConWindMode: vm.devAirConWindMode, // 空调风量自动
          devAirConTemperature:vm.devAirConTemperature // 温度
        }
      };
      DevopsTasks.addTask('/agendash/api/jobs/create', param);
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
      DevopsTasks.uniqueIds.forEach(function(id){
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
