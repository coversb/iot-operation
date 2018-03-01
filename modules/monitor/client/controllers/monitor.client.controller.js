(function () {
  'use strict';

  angular
    .module('monitor')
    .controller('MonitorController', MonitorController);

  MonitorController.$inject = ['$scope', '$state', '$http', 'Authentication', 'DevopsSettings'];

  function MonitorController($scope, $state, $http, Authentication, DevopsSettings) {

    var searchData = '';
    var vm = this;

    vm.resetList = resetList;
    vm.searchByName = searchByName;
    vm.updateBoxDetail = updateBoxDetail;

    init();

    function init() {
      // If user is not signed in then redirect back home
      if (!Authentication.user) {
        $state.go('home');
      }

      loadBoxList();
    }

    // search button
    function searchByName() {
      searchData = vm.searchData;
      $('#boxTable').bootstrapTable('refresh', {});
    }

    // reset button
    function resetList() {
      vm.searchData = searchData = '';
      $('#boxTable').bootstrapTable('destroy');
      loadBoxList();
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
        pageList: [10], // 可供选择的每页的行数（*）
        singleSelect: false,
        pageSize: 10, // 每页的记录行数
        pageNumber: 1,  // 初始化加载第一页，默认第一页,并记录
        sidePagination: 'server', // 服务端请求
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
            resetList();
          } else if (res.code === 0) {
            return {
              'total': res.count,
              'rows': res.data
            };
          }
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
            title: '通电状态',
            valign: 'middle',
            align: 'center',
            formatter: function (value, row) {
              var pwrStatDis = '<span style="color:green">' + '有市电' + '</span>';
              if (row.detail.powerStatus === 0) {
                pwrStatDis = '<span style="color:red">' + '无市电' + '</span>';
              }
              return pwrStatDis;
            }
          },
          {
            field: 'detail.networkStatus',
            title: '网络状态',
            valign: 'middle',
            align: 'center',
            formatter: function (value, row) {
              var netStatDis = '<span style="color:green">' + row.detail.networkStatus + '</span>';
              if (row.detail.networkStatus === '断网') {
                netStatDis = '<span style="color:red">' + row.detail.networkStatus + '</span>';
              }
              return netStatDis;
            }
          },
          {
            field: 'detail.airConditionMode' + 'detail.airConditionTemperature' + 'detail.airConditionWind',
            title: '空调设置',
            valign: 'middle',
            align: 'center'
          },
          {
            field: 'detail.smokeStatus',
            title: '烟雾状态',
            valign: 'middle',
            align: 'center',
            formatter: function (value, row) {
              var smokeStatDis = '<span style="color:green">' + '正常' + '</span>';
              if (row.detail.smokeStatus === '有烟雾') {
                smokeStatDis = '<span style="color:red">' + row.detail.smokeStatus + '</span>';
              }
              return smokeStatDis;
            }
          },
          {
            field: 'detail.temperature',
            title: '温度',
            valign: 'middle',
            align: 'center'
          },
          {
            field: 'detail.humidity',
            title: '湿度',
            valign: 'middle',
            align: 'center'
          },
          {
            field: 'detail.pm25',
            title: 'PM2.5',
            valign: 'middle',
            align: 'center'
          },
          {
            title: '更多',
            formatter: function (value, row) {
              return ['<button type="button"  id="boxDetail">详情</button>'];
            },
            events: window.operateEvents = {
              'click #boxDetail': function (e, value, row) {
                boxDetail(row.base.uniqueId);
              }
            },
            valign: 'middle',
            align: 'center'
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
      if (vm.selectedBox.detail.powerStatus === 1) {
        vm.selectedBox.detail.powerStatus = '有市电';
        setElementColor('#power', 'green');
      } else if (vm.selectedBox.detail.powerStatus === 0) {
        vm.selectedBox.detail.powerStatus = '无市电';
        setElementColor('#power', 'red');
      } else if (vm.selectedBox.detail.powerStatus === 2) {
        vm.selectedBox.detail.powerStatus = '电压低';
        setElementColor('#power', 'yellow');
      }

      // 设备箱状态
      if (vm.selectedBox.detail.deviceDoorStatus === '关着') {
        setElementColor('#deviceDoor', 'green');
      } else {
        setElementColor('#deviceDoor', 'red');
      }

      // 空调开关状态
      if (vm.selectedBox.detail.airConditionStatus === 'Open') {
        setElementColor('#air', 'green');
      } else {
        setElementColor('#air', 'red');
      }
    }

    function setElementColor(element, setColor) {
      $(element).css({ color: setColor });
    }

  }
}());
