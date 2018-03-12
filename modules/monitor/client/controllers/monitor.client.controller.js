(function () {
  'use strict';

  angular
    .module('monitor')
    .controller('MonitorController', MonitorController);

  MonitorController.$inject = ['$scope', '$state', '$http', 'Authentication', 'DevopsSettings'];

  function MonitorController($scope, $state, $http, Authentication, DevopsSettings) {

    var searchData = '';
    var vm = this;

    vm.searchByName = searchByName;
    vm.updateBoxDetail = updateBoxDetail;

    init();

    function init() {
      // If user is not signed in then redirect back home
      if (!Authentication.user) {
        $state.go('home');
      }
      // switch bootstrap-table'locales to zh-CN
      $.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales['zh-CN']);
      loadBoxList();
    }

    // search button
    function searchByName() {
      searchData = vm.searchData;
      $('#boxTable').bootstrapTable('refresh', {});
      vm.searchData = searchData = '';
    }

    function updateBoxDetail() {
      getBoxDetail(vm.selectedBox.base.uniqueId);
    }

    function loadBoxList() {
      $('#boxTable').bootstrapTable({
        method: 'post',
        dataType: 'json',
        contentType: 'application/json',
        url: DevopsSettings.backboneURL + DevopsSettings.boxListAPI,
        striped: true,
        pagination: true, // 是否显示分页
        pageList: [10, 20], // 可供选择的每页的行数（*）
        singleSelect: false,
        pageSize: 10, // 每页的记录行数
        pageNumber: 1,  // 初始化加载第一页，默认第一页,并记录
        sidePagination: 'server', // 服务端请求
        cache: false,
        showToggle: true,
        showRefresh: true,
        showColumns: true,
        queryParams: function (params) {  // 配置参数
          var pageNumber = 1;
          if (params.offset !== 0 && params.limit !== 0) {
            pageNumber = (params.offset / params.limit) + 1;
          }
          var param = {
            name: searchData,
            pageNum: pageNumber,  // 页码
            pageSize: params.limit  // 页面大小
          };
          searchData = '';
          vm.searchData = '';
          return param;
        },
        responseHandler: function (res) {
          // console.log(res)
          if (res.code === 1) {
            alert('请求设备信息失败！');
          } else if (res.code === 0) {
            return {
              'total': res.count,
              'rows': res.data
            };
          }
        },
        onClickRow: function (row, $element) {
          boxDetail(row.base.uniqueId);
        },
        // table headers
        columns: [
          {
            field: 'base.uniqueId',
            title: '设备ID',
            valign: 'middle',
            align: 'center'
          },
          {
            field: 'base.name',
            title: '场馆',
            valign: 'middle',
            align: 'center'
          },
          {
            field: 'detail.powerStatus',
            title: '通电',
            valign: 'middle',
            align: 'center',
            formatter: function (value, row) {
              var pwrStatDis = '<span style="color:green">' + '有市电' + '</span>';
              if (value === '0') {
                pwrStatDis = '<span style="color:red">' + '无市电' + '</span>';
              }
              return pwrStatDis;
            }
          },
          {
            field: 'detail.networkStatus',
            title: '网络',
            valign: 'middle',
            align: 'center',
            formatter: function (value, row) {
              var netStatDis = '<span style="color:green">' + value + '</span>';
              if (value === '断网') {
                netStatDis = '<span style="color:red">' + value + '</span>';
              }
              return netStatDis;
            }
          },
          {
            field: 'detail.smokeStatus',
            title: '烟雾',
            valign: 'middle',
            align: 'center',
            formatter: function (value, row) {
              var smokeStatDis = '<span style="color:green">' + '正常' + '</span>';
              if (value === '有烟雾') {
                smokeStatDis = '<span style="color:red">' + value + '</span>';
              }
              return smokeStatDis;
            }
          },
          {
            field: 'detail.doorStatus',
            title: '门禁',
            valign: 'middle',
            align: 'center',
            formatter: function (value, row) {
              var doorStatDis = '<span style="color:green">门关着</span>';
              if (value === '门开着') {
                doorStatDis = '<span style="color:red">' + value + '</span>';
              }
              return doorStatDis;
            }
          },
          {
            field: 'detail.deviceDoorStatus',
            title: '设备箱',
            valign: 'middle',
            align: 'center',
            formatter: function (value, row) {
              var devBoxDoorStatDis = '<span style="color:green">关着</span>';
              if (value === 'Open') {
                devBoxDoorStatDis = '<span style="color:red">开着</span>';
              }
              return devBoxDoorStatDis;
            }
          },
          {
            field: 'detail.airConditionStatus',
            title: '空调模式·风量·温度',
            valign: 'middle',
            align: 'center',
            formatter: function (value, row) {
              var pwrStat = '-';
              var workStat = '-';
              var windStat = '-';
              var tempStat = '-';
              if (row.detail.airConditionStatus === 'Close') {
                pwrStat = '关';
              } else if (row.detail.airConditionStatus === 'Open') {
                pwrStat = '开';
              } else if (row.detail.airConditionStatus === 'Interval') {
                pwrStat = '间隔开';
              }

              if (row.detail.airConditionMode === 'Cold') {
                workStat = '制冷';
              } else if (row.detail.airConditionMode === 'Warm') {
                workStat = '制热';
              } else if (row.detail.airConditionMode === 'Auto') {
                workStat = '自动';
              } else if (row.detail.airConditionMode === 'Dehumidify') {
                workStat = '抽湿';
              }

              if (row.detail.airConditionWind === 'High') {
                windStat = '高风';
              } else if (row.detail.airConditionWind === 'Medium') {
                windStat = '中风';
              } else if (row.detail.airConditionWind === 'Low') {
                windStat = '低风';
              } else if (row.detail.airConditionWind === 'Auto') {
                windStat = '自动风';
              }
              tempStat = row.detail.airConditionTemperature;
              if (tempStat === 0) {
                tempStat = '-';
              }
              return '<span>' + workStat + ' | ' + windStat + ' | ' + tempStat + '</span>';
            }
          },
          {
            field: 'detail.reconnectUpdateDate',
            title: '最近通讯时间',
            valign: 'middle',
            align: 'center',
            formatter: function (value, row) {
              var latestCommDis = '<span style="color:green">' + convertTimestampToDatetime(value) + '</span>';
              var curTimestamp = (Date.parse(new Date()) / 1000);
              // don't communicate with server more than 300 seconds
              if (curTimestamp - value > 300) {
                latestCommDis = '<span style="color:red">' + convertTimestampToDatetime(value) + '</span>';
              }
              return latestCommDis;
            }
          },
          {
            title: '更多',
            valign: 'middle',
            align: 'center',
            formatter: function (value, row) {
              return ['<button class="btn btn-default" id="boxDetail">详情</button>'];
            },
            events: window.operateEvents = {
              'click #boxDetail': function (e, value, row) {
                boxDetail(row.base.uniqueId);
              }
            }
          }
        ]
      });
    }

    function boxDetail(uid) {
      getBoxDetail(uid);

      $('#boxDetailDialog').modal('show');
    }

    function getBoxDetail(uid) {
      var config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      var data = {
        'uniqueId': uid,
        'pageNum': 1,
        'pageSize': 10
      };
      $http.post(DevopsSettings.backboneURL + DevopsSettings.boxListAPI, data, config)
        .success(function (data) {
          // console.log(data);
          vm.selectedBox = [];
          vm.selectedBox = data.data[0];

          datetimeFormat();
          stateColorFormat();// 详情页颜色
          detailTableFormat();
        })
        .error(function (e, status) {
          console.log('Error:' + e + ',' + status);
        });
    }

    // 时间戳转化
    function datetimeFormat() {
      // 最近一次嵌入式系统启动时间
      vm.selectedBox.detail.bootDate = convertTimestampToDatetime(vm.selectedBox.detail.bootDate);
      // 最近一次OTA开始升级时间
      vm.selectedBox.base.softwareUpdateStart = convertTimestampToDatetime(vm.selectedBox.base.softwareUpdateStart);
      // 最近一次OTA结束升级时间
      vm.selectedBox.base.softwareUpdateEnd = convertTimestampToDatetime(vm.selectedBox.base.softwareUpdateEnd);
      // 经纬度更新时间
      vm.selectedBox.base.locationUpdateDate = convertTimestampToDatetime(vm.selectedBox.base.locationUpdateDate);
      // 最近一次重新联网/数据收发时间
      vm.selectedBox.detail.reconnectUpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.reconnectUpdateDate);
      // 最近一次断网开始/板子跑飞时间
      vm.selectedBox.detail.disconnectUpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.disconnectUpdateDate);
      // 网络信号值更新时间
      vm.selectedBox.detail.networkSignalUpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.networkSignalUpdateDate);
      // 最近一次烟雾报警开始时间
      vm.selectedBox.detail.smokeAlarmStartDate = convertTimestampToDatetime(vm.selectedBox.detail.smokeAlarmStartDate);
      // 最近一次烟雾报警结束时间
      vm.selectedBox.detail.smokeAlarmTimeEndDate = convertTimestampToDatetime(vm.selectedBox.detail.smokeAlarmTimeEndDate);
      // 最近一次门禁报警开始时间
      vm.selectedBox.detail.doorAlarmStartDate = convertTimestampToDatetime(vm.selectedBox.detail.doorAlarmStartDate);
      // 最近一次门禁报警结束时间
      vm.selectedBox.detail.doorAlarmTimeEndDate = convertTimestampToDatetime(vm.selectedBox.detail.doorAlarmTimeEndDate);
      // 最近一次市电报警开始时间
      vm.selectedBox.detail.powerAlarmStartDate = convertTimestampToDatetime(vm.selectedBox.detail.powerAlarmStartDate);
      // 最近一次市电报警结束时间
      vm.selectedBox.detail.powerAlarmEndDate = convertTimestampToDatetime(vm.selectedBox.detail.powerAlarmEndDate);
      // 最后一次用户输入密码的时间
      vm.selectedBox.detail.doorPasswordUpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.doorPasswordUpdateDate);
      // 设备箱状态更新时间
      vm.selectedBox.detail.deviceDoorStatusUpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.deviceDoorStatusUpdateDate);
      // 空调模式、温度、风量控制更新时间
      vm.selectedBox.detail.airConditionControlUpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.airConditionControlUpdateDate);
      // 最近一次空调开关状态指令下发时间
      vm.selectedBox.detail.airConditionEventUpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.airConditionEventUpdateDate);
      // 室内温度更新时间
      vm.selectedBox.detail.temperatureUpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.temperatureUpdateDate);
      // 室内湿度更新时间
      vm.selectedBox.detail.humidityUpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.humidityUpdateDate);
      // pm更新时间
      vm.selectedBox.detail.pm25UpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.pm25UpdateDate);
      // 继电器输入更新时间
      vm.selectedBox.detail.input1StatusUpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.input1StatusUpdateDate);
      vm.selectedBox.detail.input2StatusUpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.input2StatusUpdateDate);
      vm.selectedBox.detail.input3StatusUpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.input3StatusUpdateDate);
      vm.selectedBox.detail.input4StatusUpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.input4StatusUpdateDate);
      vm.selectedBox.detail.input5StatusUpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.input5StatusUpdateDate);
      vm.selectedBox.detail.input6StatusUpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.input6StatusUpdateDate);
      vm.selectedBox.detail.input7StatusUpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.input7StatusUpdateDate);
      vm.selectedBox.detail.input8StatusUpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.input8StatusUpdateDate);
      vm.selectedBox.detail.input9StatusUpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.input9StatusUpdateDate);
      vm.selectedBox.detail.input10StatusUpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.input10StatusUpdateDate);
      vm.selectedBox.detail.input11StatusUpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.input11StatusUpdateDate);
      vm.selectedBox.detail.input12StatusUpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.input12StatusUpdateDate);
      vm.selectedBox.detail.input13StatusUpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.input13StatusUpdateDate);
      vm.selectedBox.detail.input14StatusUpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.input14StatusUpdateDate);
      vm.selectedBox.detail.input15StatusUpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.input15StatusUpdateDate);
      vm.selectedBox.detail.input16StatusUpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.input16StatusUpdateDate);
      // 继电器输出更新时间
      vm.selectedBox.detail.outputStatus1UpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.outputStatus1UpdateDate);
      vm.selectedBox.detail.outputStatus2UpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.outputStatus2UpdateDate);
      vm.selectedBox.detail.outputStatus3UpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.outputStatus3UpdateDate);
      vm.selectedBox.detail.outputStatus4UpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.outputStatus4UpdateDate);
      vm.selectedBox.detail.outputStatus5UpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.outputStatus5UpdateDate);
      vm.selectedBox.detail.outputStatus6UpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.outputStatus6UpdateDate);
      vm.selectedBox.detail.outputStatus7UpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.outputStatus7UpdateDate);
      vm.selectedBox.detail.outputStatus8UpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.outputStatus8UpdateDate);
      vm.selectedBox.detail.outputStatus9UpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.outputStatus9UpdateDate);
      vm.selectedBox.detail.outputStatus10UpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.outputStatus10UpdateDate);
      vm.selectedBox.detail.outputStatus11UpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.outputStatus11UpdateDate);
      vm.selectedBox.detail.outputStatus12UpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.outputStatus12UpdateDate);
      vm.selectedBox.detail.outputStatus13UpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.outputStatus13UpdateDate);
      vm.selectedBox.detail.outputStatus14UpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.outputStatus14UpdateDate);
      vm.selectedBox.detail.outputStatus15UpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.outputStatus15UpdateDate);
      vm.selectedBox.detail.outputStatus16UpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.outputStatus16UpdateDate);
      vm.selectedBox.detail.outputStatus17UpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.outputStatus17UpdateDate);
      vm.selectedBox.detail.outputStatus18UpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.outputStatus18UpdateDate);
      vm.selectedBox.detail.outputStatus19UpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.outputStatus19UpdateDate);
      vm.selectedBox.detail.outputStatus20UpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.outputStatus20UpdateDate);
      vm.selectedBox.detail.outputStatus21UpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.outputStatus21UpdateDate);
      vm.selectedBox.detail.outputStatus22UpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.outputStatus22UpdateDate);
      vm.selectedBox.detail.outputStatus23UpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.outputStatus23UpdateDate);
      vm.selectedBox.detail.outputStatus24UpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.outputStatus24UpdateDate);
      vm.selectedBox.detail.outputStatus25UpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.outputStatus25UpdateDate);
      vm.selectedBox.detail.outputStatus26UpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.outputStatus26UpdateDate);
      vm.selectedBox.detail.outputStatus27UpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.outputStatus27UpdateDate);
      vm.selectedBox.detail.outputStatus28UpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.outputStatus28UpdateDate);
      vm.selectedBox.detail.outputStatus29UpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.outputStatus29UpdateDate);
      vm.selectedBox.detail.outputStatus30UpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.outputStatus30UpdateDate);
      vm.selectedBox.detail.outputStatus31UpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.outputStatus31UpdateDate);
      vm.selectedBox.detail.outputStatus32UpdateDate = convertTimestampToDatetime(vm.selectedBox.detail.outputStatus32UpdateDate);
    }

    function convertTimestampToDatetime(UnixTime) {
      var b = UnixTime;
      if (b !== 0 && b !== null && b !== undefined && b !== '') {
        b = (b * 1000).toString();
        var a = b.replace('/Date(', '').replace(')/', '');
        var date = new Date(parseInt(a, 10));
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        return y + '/' + m + '/' + d + ' ' + h + ':' + minute + ':' + second;
      } else {
        return 0;
      }
    }

    // 详情页颜色
    function stateColorFormat() {
      // 网络状态
      if (vm.selectedBox.detail.networkStatus === '在线') {
        setElementColor('#net', 'green');
      } else {
        setElementColor('#net', 'red');
      }

      // 烟雾状态
      if (vm.selectedBox.detail.smokeStatus === '无烟雾') {
        setElementColor('#smoke', 'green');
      } else {
        setElementColor('#smoke', 'red');
      }

      // 门禁状态
      if (vm.selectedBox.detail.doorStatus === '门关着') {
        setElementColor('#door', 'green');
      } else {
        setElementColor('#door', 'red');
      }

      // 通电状态
      if (vm.selectedBox.detail.powerStatus === '1') {
        vm.selectedBox.detail.powerStatus = '有市电';
        setElementColor('#power', 'green');
      } else if (vm.selectedBox.detail.powerStatus === '0') {
        vm.selectedBox.detail.powerStatus = '无市电';
        setElementColor('#power', 'red');
      } else if (vm.selectedBox.detail.powerStatus === '2') {
        vm.selectedBox.detail.powerStatus = '电压低';
        setElementColor('#power', 'yellow');
      }

      // 设备箱状态
      if (vm.selectedBox.detail.deviceDoorStatus === 'Close') {
        setElementColor('#deviceDoor', 'green');
      } else {
        setElementColor('#deviceDoor', 'red');
      }

      // 空调开关状态
      /* don't need color
      if (vm.selectedBox.detail.airConditionStatus === 'Open') {
        setElementColor('#air', 'green');
      } else {
        setElementColor('#air', 'red');
      }
      */
    }

    function detailTableFormat() {
      vm.selectedBoxDis = [];

      detailInputStateFormat();
      detailOutputStateFormat();
    }

    function detailInputStateFormat() {
      if (undefined === vm.selectedBox.detail.inputState) {
        return;
      }

      // input status display
      var inputMask = parseInt(vm.selectedBox.detail.inputState, 16);
      // power supply
      if (checkMaskBit(inputMask, 1)) {
        vm.selectedBoxDis.pwrSupply = '正常';
        setElementColor('#detailTablePwrSupply', 'green');
      } else {
        vm.selectedBoxDis.pwrSupply = '断电';
        setElementColor('#detailTablePwrSupply', 'red');
      }

      // device box loc
      if (checkMaskBit(inputMask, 11)) {
        vm.selectedBoxDis.devBoxLock = '关闭';
        setElementColor('#detailTableDevBoxLock', 'green');
      } else {
        vm.selectedBoxDis.devBoxLock = '打开';
        setElementColor('#detailTableDevBoxLock', 'red');
      }

      // smoke sensor 1
      if (checkMaskBit(inputMask, 2)) {
        vm.selectedBoxDis.smokeSensor1 = '正常';
        setElementColor('#detailTableSmokeSensor1', 'green');
      } else {
        vm.selectedBoxDis.smokeSensor1 = '有烟雾';
        setElementColor('#detailTableSmokeSensor1', 'red');
      }

      // smoke sensor 2
      if (checkMaskBit(inputMask, 3)) {
        vm.selectedBoxDis.smokeSensor2 = '正常';
        setElementColor('#detailTableSmokeSensor2', 'green');
      } else {
        vm.selectedBoxDis.smokeSensor2 = '有烟雾';
        setElementColor('#detailTableSmokeSensor2', 'red');
      }

      // people detection sensor 1
      if (checkMaskBit(inputMask, 6)) {
        vm.selectedBoxDis.irSensor1 = '无人';
        setElementColor('#detailTableIrSensor1', 'green');
      } else {
        vm.selectedBoxDis.irSensor1 = '有人';
        setElementColor('#detailTableIrSensor1', 'red');
      }

      // people detection sensor 2
      if (checkMaskBit(inputMask, 7)) {
        vm.selectedBoxDis.irSensor2 = '无人';
        setElementColor('#detailTableIrSensor2', 'green');
      } else {
        vm.selectedBoxDis.irSensor2 = '有人';
        setElementColor('#detailTableIrSensor2', 'red');
      }
    }

    function detailOutputStateFormat() {
      if (undefined === vm.selectedBox.detail.outputState) {
        return;
      }

      // output status display
      var outputMask = parseInt(vm.selectedBox.detail.outputState, 16);
      // exhaust switch
      if (checkMaskBit(outputMask, 4)) {
        vm.selectedBoxDis.exhaust = '开';
      } else {
        vm.selectedBoxDis.exhaust = '关';
      }
      setOutputStateDisplay(vm.selectedBoxDis.exhaust, '#detailTableExhaust');

      // fresh air switch
      if (checkMaskBit(outputMask, 11)) {
        vm.selectedBoxDis.freshAir = '开';
      } else {
        vm.selectedBoxDis.freshAir = '关';
      }
      setOutputStateDisplay(vm.selectedBoxDis.freshAir, '#detailTableFreshAir');

      // air conditioner 1 switch
      if (checkMaskBit(outputMask, 5)) {
        vm.selectedBoxDis.airCon1 = '开';
      } else {
        vm.selectedBoxDis.airCon1 = '关';
      }
      setOutputStateDisplay(vm.selectedBoxDis.airCon1, '#detailTableAirCon1');

      // air conditioner 2 switch
      if (checkMaskBit(outputMask, 6)) {
        vm.selectedBoxDis.airCon2 = '开';
      } else {
        vm.selectedBoxDis.airCon2 = '关';
      }
      setOutputStateDisplay(vm.selectedBoxDis.airCon2, '#detailTableAirCon2');

      // ground plug 1 switch
      if (checkMaskBit(outputMask, 7)) {
        vm.selectedBoxDis.groundPlug1 = '开';
      } else {
        vm.selectedBoxDis.groundPlug1 = '关';
      }
      setOutputStateDisplay(vm.selectedBoxDis.groundPlug1, '#detailTableGroundPlug1');

      // ground plug 2 switch
      if (checkMaskBit(outputMask, 8)) {
        vm.selectedBoxDis.groundPlug2 = '开';
      } else {
        vm.selectedBoxDis.groundPlug2 = '关';
      }
      setOutputStateDisplay(vm.selectedBoxDis.groundPlug2, '#detailTableGroundPlug2');

      // vending machine
      if (checkMaskBit(outputMask, 12)) {
        vm.selectedBoxDis.vendingMachine = '开';
      } else {
        vm.selectedBoxDis.vendingMachine = '关';
      }
      setOutputStateDisplay(vm.selectedBoxDis.vendingMachine, '#detailTableVendingMachine');

      // indoor TV
      if (checkMaskBit(outputMask, 10)) {
        vm.selectedBoxDis.indoorTv = '开';
      } else {
        vm.selectedBoxDis.indoorTv = '关';
      }
      setOutputStateDisplay(vm.selectedBoxDis.indoorTv, '#detailTableIndoorTv');

      // indoor light
      if (checkMaskBit(outputMask, 9)) {
        vm.selectedBoxDis.indoorLight = '开';
      } else {
        vm.selectedBoxDis.indoorLight = '关';
      }
      setOutputStateDisplay(vm.selectedBoxDis.indoorLight, '#detailTableIndoorLight');

      // emergency light
      if (checkMaskBit(outputMask, 13)) {
        vm.selectedBoxDis.emergencyLight = '开';
      } else {
        vm.selectedBoxDis.emergencyLight = '关';
      }
      setOutputStateDisplay(vm.selectedBoxDis.emergencyLight, '#detailTableEmergencyLight');
    }

    function setOutputStateDisplay(value, element) {
      if (value === '开') {
        setElementColor(element, 'green');
      } else if (value === '关') {
        setElementColor(element, 'red');
      }
    }

    function checkMaskBit(mask, bit) {
      var res = (mask & (1 << bit));
      if (res === 0) {
        return false;
      } else {
        return true;
      }
    }

    function setElementColor(element, setColor) {
      $(element).css({ color: setColor });
    }

  }
}());
