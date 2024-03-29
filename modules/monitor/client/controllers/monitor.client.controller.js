(function () {
  'use strict';

  angular
    .module('monitor')
    .controller('MonitorController', MonitorController);

  MonitorController.$inject = ['$scope', '$filter', '$state', '$http', 'Authentication', 'DevopsSettings'];

  function MonitorController($scope, $filter, $state, $http, Authentication, DevopsSettings) {

    var searchData = '';
    var doSearch = false;
    var vm = this;

    // vm.deviceDoorStatus = ["开", "关"];

    vm.searchByName = searchByName;
    vm.updateBoxDetail = updateBoxDetail;

    // sprintf is dependency function taken from bootstrap-table.js source code
    var sprintf = function (str) {
      var args = arguments,
        flag = true,
        i = 1;

      str = str.replace(/%s/g, function () {
        var arg = args[i++];
        if (typeof arg === 'undefined') {
          flag = false;
          return '';
        }
        return arg;
      });
      return flag ? str : '';
    };

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
      doSearch = true;
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
          if (doSearch) {
            doSearch = false;
          } else {
            if (params.offset !== 0 && params.limit !== 0) {
              pageNumber = (params.offset / params.limit) + 1;
            }
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
            title: 'ID(场馆·主板)',
            valign: 'middle',
            align: 'center',
            formatter: function (value, row) {
              return '<span style="color:#cd6a00">' + row.base.venueId + '</span>' + '|' + value;
            }
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

              return badNetStatusCheck(row, pwrStatDis);
            }
          },
          {
            field: 'detail.networkStatus',
            title: '网络',
            valign: 'middle',
            align: 'center',
            formatter: function (value, row) {
              var signalGraph = '<br>';
              var netStatDis = '<span style="color:green">' + value + '</span>';
              if (value === '断网') {
                netStatDis = '<span style="color:red">' + value + '</span>';
              }

              if (row.detail.networkSignalStrength === 255) {
                signalGraph += '有线' + getSignalGraph(255);
              } else {
                var signal = -113 + (row.detail.networkSignalStrength * 2);
                signalGraph += '2G' + getSignalGraph(signal);
              }
              return netStatDis + signalGraph;
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
              return badNetStatusCheck(row, smokeStatDis);
            }
          },
          {
            field: 'detail.doorStatus',
            title: '门禁',
            valign: 'middle',
            align: 'center',
            formatter: function (value, row) {
              var doorStatusDis = sprintf('<span style="color:%s">%s</span>'
                , value ? 'red' : 'green'
                , $filter('doorStatus')(value));
              return badNetStatusCheck(row, doorStatusDis);
            }
          },
          {
            field: 'detail.deviceDoorStatus',
            title: '设备箱',
            valign: 'middle',
            align: 'center',
            formatter: function (value, row) {
              var deviceDoorStatusDis = sprintf('<span style="color:%s">%s</span>', value ? 'green' : 'red', $filter('deviceDoorStatus')(value));
              return badNetStatusCheck(row, deviceDoorStatusDis);
            }
          },
          {
            field: 'detail.airConditionStatus',
            title: '空调(模式·风量·温度)',
            valign: 'middle',
            align: 'center',
            formatter: function (value, row) {
              var pwrStat = '-';
              var workStat = '-';
              var windStat = '-';
              var tempStat = '-';
              var dstTemperature = '-';
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
                // Auto stand for wind in IOT protocol V1.23, better to modified this value to wind
                workStat = '送风';
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
              return '<span>' + workStat + ' | ' + windStat + ' | ' + tempStat + '℃</span>';
            }
          },
          {
            field: 'detail.dstTemperature',
            title: '智能温控(温度·湿度·开关)',
            valign: 'middle',
            align: 'center',
            formatter: function (value, row) {
              var tmpSwitch = '<span style="color:red">' + '关' + '</span>';
              if (row.detail.dstSwitch === 1) {
                tmpSwitch = '<span style="color:green">' + '开' + '</span>';
              }
              var dstTempDis = '-';
              if (row.detail.dstTemperature !== undefined) {
                dstTempDis = row.detail.dstTemperature + '℃';
              }
              var dstHumDis = '-';
              if (row.detail.dstHumidity !== undefined) {
                dstHumDis = row.detail.dstHumidity + '%';
              }
              return '<span>' + dstTempDis + ' | ' + dstHumDis + ' | ' + tmpSwitch + '</span>';
            }
          },
          {
            field: 'detail.temperature',
            title: '实时(温度·湿度)',
            valign: 'middle',
            align: 'center',
            formatter: function (value, row) {
              var tempDis = '-';
              if (row.detail.temperature !== 0) {// default value need optimize
                tempDis = row.detail.temperature + '℃';
              }
              var humiDis = '-';
              if (row.detail.humidity !== 0) {// default value need optimize
                humiDis = row.detail.humidity + '%';
              }
              var realTHDis = '<span style="color:green">' + tempDis + ' | ' + humiDis + '</span>';
              var curTimestamp = (Date.parse(new Date()) / 1000);
              if ((realTHDis.indexOf('-') < 0) && (curTimestamp - row.detail.temperatureUpdateDate > 600)) {
                realTHDis = '<span style="color:red">' + tempDis + ' | ' + humiDis + '</span>';
              }
              return realTHDis;
            }
          },
          {
            field: 'detail.reconnectUpdateDate',
            title: '最近通讯时间',
            valign: 'middle',
            align: 'center',
            formatter: function (value, row) {
              var latestCommDis = '<span style="color:green">' + $filter('date')(value * 1000, 'yyyy-MM-dd HH:mm:ss') + '</span>';
              var curTimestamp = (Date.parse(new Date()) / 1000);
              // don't communicate with server more than 300 seconds
              if (curTimestamp - value > 300) {
                latestCommDis = '<span style="color:red">' + $filter('date')(value * 1000, 'yyyy-MM-dd HH:mm:ss') + '</span>';
              }
              return latestCommDis;
            }
          }
          /*
          ,
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
          }*/
        ]
      });
    }

    function badNetStatusCheck(row, data) {
      if (row.detail.networkStatus === '断网') {
        if (data.indexOf('green') > 0) {
          return data.replace(/green/, 'blue');
        } else {
          return data.replace(/red/, 'blue');
        }
      }
      return data;
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

          stateColorFormat();// 详情页颜色
          detailTableFormat();
        })
        .error(function (e, status) {
          console.log('Error:' + e + ',' + status);
        });
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
      if (vm.selectedBox.detail.doorStatus === 0) {
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
      if (vm.selectedBox.detail.deviceDoorStatus === 1) {
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

      detailSignalStateFormat();
      detailAirconditionerStateFormat();
      detailInputStateFormat();
      detailOutputStateFormat();
    }

    function getSignalGraph(dbm) {
      var graph = '';
      if (dbm >= -57) {// csq 28
        graph = '<ul class="signal-bars bars-4"><li class="first-bar bar"><div></div></li><li class="second-bar bar"><div></div></li><li class="third-bar bar"><div></div></li><li class="fourth-bar bar"><div></div></li></ul>';
      } else if (dbm >= -73) {// csq 20
        graph = '<ul class="signal-bars bars-3"><li class="first-bar bar"><div></div></li><li class="second-bar bar"><div></div></li><li class="third-bar bar"><div></div></li><li class="fourth-bar bar"><div></div></li></ul>';
      } else if (dbm >= -87) {// csq 13
        graph = '<ul class="signal-bars bars-2"><li class="first-bar bar"><div></div></li><li class="second-bar bar"><div></div></li><li class="third-bar bar"><div></div></li><li class="fourth-bar bar"><div></div></li></ul>';
      } else {// csq < 13
        graph = '<ul class="signal-bars bars-1"><li class="first-bar bar"><div></div></li><li class="second-bar bar"><div></div></li><li class="third-bar bar"><div></div></li><li class="fourth-bar bar"><div></div></li></ul>';
      }

      return graph;
    }

    function detailSignalStateFormat() {
      vm.selectedBoxDis.signalGraph = '网络信号强度:&nbsp&nbsp';
      if (vm.selectedBox.detail.networkSignalStrength === 255) {
        vm.selectedBoxDis.signalGraph += getSignalGraph(255);
        vm.selectedBoxDis.signal = '有线网络';
      } else {
        var signal = -113 + (vm.selectedBox.detail.networkSignalStrength * 2);
        vm.selectedBoxDis.signalGraph += getSignalGraph(signal);
        vm.selectedBoxDis.signal = signal + 'dBm (' + vm.selectedBox.detail.networkSignalStrength + ')';
      }
    }

    function detailAirconditionerStateFormat() {
      if (vm.selectedBox.detail.airConditionStatus === 'Close') {
        vm.selectedBoxDis.pwrStat = '关';
      } else if (vm.selectedBox.detail.airConditionStatus === 'Open') {
        vm.selectedBoxDis.pwrStat = '开';
      } else if (vm.selectedBox.detail.airConditionStatus === 'Interval') {
        vm.selectedBoxDis.pwrStat = '间隔开';
      }

      if (vm.selectedBox.detail.airConditionMode === 'Cold') {
        vm.selectedBoxDis.workStat = '制冷';
      } else if (vm.selectedBox.detail.airConditionMode === 'Warm') {
        vm.selectedBoxDis.workStat = '制热';
      } else if (vm.selectedBox.detail.airConditionMode === 'Auto') {
        // Auto stand for wind in IOT protocol V1.23, better to modified this value to wind
        vm.selectedBoxDis.workStat = '送风';
      } else if (vm.selectedBox.detail.airConditionMode === 'Dehumidify') {
        vm.selectedBoxDis.workStat = '抽湿';
      }

      if (vm.selectedBox.detail.airConditionWind === 'High') {
        vm.selectedBoxDis.windStat = '高风';
      } else if (vm.selectedBox.detail.airConditionWind === 'Medium') {
        vm.selectedBoxDis.windStat = '中风';
      } else if (vm.selectedBox.detail.airConditionWind === 'Low') {
        vm.selectedBoxDis.windStat = '低风';
      } else if (vm.selectedBox.detail.airConditionWind === 'Auto') {
        vm.selectedBoxDis.windStat = '自动风';
      }
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

      // outdoor light box
      if (checkMaskBit(outputMask, 15)) {
        vm.selectedBoxDis.outdoorLightBox = '开';
      } else {
        vm.selectedBoxDis.outdoorLightBox = '关';
      }
      setOutputStateDisplay(vm.selectedBoxDis.outdoorLightBox, '#detailTableOutdoorLightBox');

      // adv machine 1
      if (checkMaskBit(outputMask, 16)) {
        vm.selectedBoxDis.advMachine1 = '开';
      } else {
        vm.selectedBoxDis.advMachine1 = '关';
      }
      setOutputStateDisplay(vm.selectedBoxDis.advMachine1, '#detailTableAdvMachine1');

      // adv machine 2
      if (checkMaskBit(outputMask, 17)) {
        vm.selectedBoxDis.advMachine2 = '开';
      } else {
        vm.selectedBoxDis.advMachine2 = '关';
      }
      setOutputStateDisplay(vm.selectedBoxDis.advMachine2, '#detailTableAdvMachine2');
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
