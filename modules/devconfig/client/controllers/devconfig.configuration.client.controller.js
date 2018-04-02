(function () {
  'use strict';

  angular
    .module('devconfig.configuration')
    .controller('DevconfigConfigurationController', DevconfigConfigurationController);

  DevconfigConfigurationController.$inject = ['$scope', '$state', '$window', '$http', 'Authentication', 'Notification', 'DevconfigManagementService', 'DevopsSettings', 'DevopsProt'];

  function DevconfigConfigurationController($scope, $state, $window, $http, Authentication, Notification, DevconfigManagementService, DevopsSettings, DevopsProt) {
    var searchData = '';
    var doSearch = false;

    var devConfigProviderMap = new Map([
      ['APC', DevconfigManagementService.apcCommand],
      ['SER', DevconfigManagementService.serCommand],
      ['CFG', DevconfigManagementService.cfgCommand],
      ['TMA', DevconfigManagementService.tmaCommand],
      ['DOG', DevconfigManagementService.dogCommand],
      ['ACO', DevconfigManagementService.acoCommand],
      ['OMC', DevconfigManagementService.omcCommand],
      ['DOA', DevconfigManagementService.doaCommand]
    ]);
    var devConfigMap = new Map([]);

    var vm = this;

    vm.searchData = '';
    vm.selectedUID = [];
    vm.configType = 'APC';

    vm.configTypeChange = configTypeChange;
    vm.searchByName = searchByName;
    vm.modalConfigChange = modalConfigChange;
    vm.configSend = configSend;
    vm.fillDatetime = fillDatetime;

    init();
    configTypeChange();

    function init() {
      // If user is not signed in then redirect back home
      if (!Authentication.user) {
        $state.go('home');
      }
      // switch bootstrap-table'locales to zh-CN
      $.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales['zh-CN']);
      loadBoxList();
    }

    function avaliableConfigsUpdate() {
      vm.modalSelectedConfig = undefined;
      vm.avaliableConfigs = devConfigMap.get(vm.configType).data;
      if (vm.avaliableConfigs.length !== 0) {
        vm.modalSelectedConfig = vm.modalData = vm.avaliableConfigs[0];
      }
    }

    function configTypeChange() {
      if (devConfigMap.get(vm.configType) === undefined) {
        devConfigProviderMap.get(vm.configType).get().$promise
          .then(function (res) {
            devConfigMap.set(vm.configType, res);
            // console.log(devConfigMap);
            avaliableConfigsUpdate();
          });
      } else {
        avaliableConfigsUpdate();
      }
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
        toolbar: '#toolbar',
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
            alert('请求场馆列表失败！' + res.code);
          } else if (res.code === 0) {
            return {
              'total': res.count,
              'rows': res.data
            };
          }
        },
        onClickRow: function (row, $element) {
        },
        // table headers
        columns: [
          {
            checkbox: true
          },
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
            title: '操作',
            field: '_id',
            align: 'center',
            formatter: function (value, row) {
              return [
                '<a href="#" mce_href="#" id="configSingle">配置下发</a>'
              ];
            },
            events: window.operateEvents = {
              'click #configSingle': function (e, value, row) {
                vm.selectedUID[0] = row.base.uniqueId;
                configModalShow();
              }
            }
          }
        ]
      });
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

    /* toolbar */
    function searchByName() {
      searchData = vm.searchData;
      doSearch = true;
      $('#boxTable').bootstrapTable('refresh', {});
      vm.searchData = searchData = '';
    }

    function configModalShow() {
      if (devConfigMap.get(vm.configType).count === 0) {
        alert('无可用配置，请先添加');
      } else {
        vm.modalData = devConfigMap.get(vm.configType).data[0];
        $('#' + vm.configType + 'Modal').modal('show');
      }
    }

    function modalConfigChange() {
      vm.modalData = devConfigMap.get(vm.configType).data.find(function (v) {
        return v._id === vm.modalSelectedConfig._id;
      });
    }

    // 批量配置下发
    $('#btnBatchConfig').click(function () {
      vm.selectedUID = $('#boxTable').bootstrapTable('getAllSelections').map(function (row) {
        return row.base.uniqueId;
      });

      if (vm.selectedUID.length === 0) {
        alert('请选择需要下发配置的场馆');
      } else {
        configModalShow();
      }
    });

    function showSendRes(data, status) {
      if (status === 200) {
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> 发送成功!' });
      } else {
        Notification.error({ message: data, title: '<i class="glyphicon glyphicon-remove"></i> 发送失败!' });
      }
    }

    function configSend() {
      if ($window.confirm('确定向[' + vm.selectedUID.length + ']个场馆下发[' + vm.configType + ']?')) {
        for (var idx = 0; idx < vm.selectedUID.length; idx++) {
          vm.modalData.uid = vm.selectedUID[idx];
          DevopsProt.sendCommand(vm.configType, vm.modalData, showSendRes);
        }
      }
    }

    /**
     * Util functions
     */
    function fillDatetime() {
      return (Date.parse(new Date()) / 1000).toString(10);
    }

  }
}());
