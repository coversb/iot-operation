(function () {
  'use strict';

  angular
    .module('devconfig.management')
    .controller('DevconfigManagementController', DevconfigManagementController);

  DevconfigManagementController.$inject = ['$scope', '$state', '$window', '$http', 'Authentication', 'Notification', 'DevconfigManagementService'];

  function DevconfigManagementController($scope, $state, $window, $http, Authentication, Notification, DevconfigManagementService) {

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

    vm.configType = 'APC';
    vm.txtSearchName = '';

    vm.configTypeChange = configTypeChange;
    vm.searchConfig = searchConfig;
    vm.configUpdate = configUpdate;
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
      loadConfigList();
    }

    function configTypeChange() {
      if (devConfigMap.get(vm.configType) === undefined) {
        devConfigProviderMap.get(vm.configType).get().$promise
          .then(function (res) {
            devConfigMap.set(vm.configType, res);
            // console.log(devConfigMap);
          });
      }
      // console.log('loadConfigList' + DevconfigManagementService.apiMap.get(vm.configType));
      $('#configTable').bootstrapTable('refresh', { url: DevconfigManagementService.apiMap.get(vm.configType) });
    }

    function loadConfigList() {
      $('#configTable').bootstrapTable({
        method: 'get',
        dataType: 'json',
        contentType: 'application/json',
        url: DevconfigManagementService.apiMap.get(vm.configType),
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
          if (params.offset !== 0 && params.limit !== 0) {
            pageNumber = (params.offset / params.limit) + 1;
          }
          var param = {
            name: vm.txtSearchName,
            pageNum: pageNumber,  // 页码
            pageSize: params.limit  // 页面大小
          };
          return param;
        },
        responseHandler: function (res) {
          if (res.code === 'success') {
            return {
              'total': res.count,
              'rows': res.data
            };
          } else {
            alert('请求设备信息失败！' + res.code);
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
            field: 'name',
            title: '配置名称',
            valign: 'middle',
            align: 'center'
          },
          {
            field: 'notes',
            title: '备注',
            valign: 'middle',
            align: 'center'
          },
          {
            field: 'user.displayName',
            title: '创建者',
            valign: 'middle',
            align: 'center'
          },
          {
            field: 'created',
            title: '创建时间',
            valign: 'middle',
            align: 'center'
          },
          {
            title: '操作',
            field: '_id',
            align: 'center',
            formatter: function (value, row) {
              return [
                '<a href="#" mce_href="#" id="configSingleEdit">编辑</a> ' +
                '<a href="#" mce_href="#" id="configSingleDel">删除</a>'
              ];
            },
            events: window.operateEvents = {
              'click #configSingleEdit': function (e, value, row) {
                configModalShow(row);
              },
              'click #configSingleDel': function (e, value, row) {
                if ($window.confirm('确定删除[' + row.name + ']?')) {
                  configDeleteSingle(row._id);
                }
              }
            }
          }
        ]
      });
    }

    /* toolbar */
    function searchConfig() {
      $('#configTable').bootstrapTable('refresh', { url: DevconfigManagementService.apiMap.get(vm.configType) });
    }

    $('#btnAddConfig').click(function () {
      configModalShow();
    });

    function configModalShow(param) {
      if (param !== undefined) {
        vm.modal = param;
      } else {
        vm.modal = {
          _id: undefined,
          created: undefined
        };

        // init some default value
        switch (vm.configType) {
          case 'APC': {
            vm.modal.mainDNS = [114, 114, 114, 114];
            vm.modal.backupDNS = [114, 114, 114, 114];
            break;
          }
          case 'SER': {
            vm.modal.mode = '2';
            vm.modal.sms = '13888888888';
            vm.modal.hbpInterval = '5';
            vm.modal.maxRandomTime = '0';
            break;
          }
          case 'CFG': {
            vm.modal.infInterval = '60';
            break;
          }
          case 'TMA': {
            vm.modal.autoAdjust = '1';
            break;
          }
          case 'DOG': {
            vm.modal.sw = '0';
            vm.modal.report = '1';
            break;
          }
          case 'ACO': {
            vm.modal.pwrMode = '1';
            vm.modal.workMode = '2';
            vm.modal.wind = '3';
            vm.modal.interval = '60';
            vm.modal.duration = '60';
            break;
          }
          default:
            break;
        }
      }

      $scope.$apply();
      $('#' + vm.configType + 'Modal').modal('show');
    }

    // 批量删除
    $('#btnDelConfig').click(function () {
      var selectedItem = $('#configTable').bootstrapTable('getSelections');

      if (selectedItem.length === 0) {
        alert('请选择需要删除的配置');
      } else {
        if ($window.confirm('确定删除选中的[' + selectedItem.length + ']个版本?')) {
          for (var idx = 0; idx < selectedItem.length; idx++) {
            configDeleteSingle(selectedItem[idx]._id);
          }
        }
      }
    });

    // Create a new config, or update the current instance
    function configUpdate() {
      var cfg = devConfigMap.get(vm.configType);
      if (cfg === undefined) {
        alert('未知类型' + vm.configType);
      } else {
        angular.extend(cfg, vm.modal);
        cfg.createOrUpdate()
          .then(successCallback)
          .catch(errorCallback);
      }

      function successCallback(res) {
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> 配置信息保存成功!' });
        $('#' + vm.configType + 'Modal').modal('hide');
        $('#configTable').bootstrapTable('refresh', { url: DevconfigManagementService.apiMap.get(vm.configType) });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> 配置信息保存失败!' });
      }
    }

    // delete single config
    function configDeleteSingle(id) {
      var cfg = devConfigMap.get(vm.configType);
      if (cfg === undefined) {
        alert('未知类型' + vm.configType);
      } else {
        cfg._id = id;
        cfg.deleteSingle()
          .then(successCallback)
          .catch(errorCallback);
      }

      function successCallback(res) {
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> 配置信息删除成功!' });
        $('#configTable').bootstrapTable('refresh', { url: DevconfigManagementService.apiMap.get(vm.configType) });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> 配置信息删除失败!' });
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
