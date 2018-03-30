(function () {
  'use strict';

  angular
    .module('devconfig.management')
    .controller('DevconfigManagementController', DevconfigManagementController);

  DevconfigManagementController.$inject = ['$scope', '$state', '$window', '$http', 'Authentication', 'Notification', 'DevconfigManagementService',
    'devconfigApcResolve', 'devconfigSerResolve'];

  function DevconfigManagementController($scope, $state, $window, $http, Authentication, Notification, DevconfigManagementService,
                                         devconfigApc, devconfigSer) {

    var devConfigMap = new Map([
      ['APC', devconfigApc],
      ['SER', devconfigSer]
    ]);

    var vm = this;

    vm.configType = 'APC';
    vm.txtSearchName = '';

    vm.configTypeChange = configTypeChange;
    vm.searchConfig = searchConfig;
    vm.configUpdate = configUpdate;

    init();

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
      console.log('loadConfigList' + DevconfigManagementService.apiMap.get(vm.configType));
      $('#configTable').bootstrapTable('refresh', {url: DevconfigManagementService.apiMap.get(vm.configType)});
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
      $('#configTable').bootstrapTable('refresh', {url: DevconfigManagementService.apiMap.get(vm.configType)});
    }

    $('#btnAddConfig').click(function () {
      configModalShow();
    });

    function configModalShow(param) {
      switch (vm.configType) {
        case 'APC': {
          apcModalShow(param);
          break;
        }
        case 'SER': {
          serModalShow(param);
          break;
        }
        default:
          break;
      }
    }

    function apcModalShow(param) {
      if (param !== undefined) {
        vm.modal = {
          _id: param._id,
          name: param.name,
          notes: param.notes,
          apn: param.apn,
          apnUserName: param.apnUserName,
          apnPassword: param.apnPassword,
          mainDNS: param.mainDNS,
          backupDNS: param.backupDNS
        };
        $('#apcModalTitle').text('[修改] 入网配置(Access Point Configuration)');
      } else {
        vm.modal = {
          _id: undefined,
          created: undefined,
          name: '',
          notes: '',
          apn: '',
          apnUserName: '',
          apnPassword: '',
          mainDNS: [114, 114, 114, 114],
          backupDNS: [114, 114, 114, 114]
        };
        $('#apcModalTitle').text('[新增] 入网配置(Access Point Configuration)');
      }
      console.log(vm.modal);

      $('#apcModalName').val(vm.modal.name);
      $('#apcModalNotes').val(vm.modal.notes);
      $('#apcModalAPN').val(vm.modal.apn);
      $('#apcModalAPNUserName').val(vm.modal.apnUserName);
      $('#apcModalAPNPassword').val(vm.modal.apnPassword);
      $('#apcModalMainDNS1').val(vm.modal.mainDNS[0]);
      $('#apcModalMainDNS2').val(vm.modal.mainDNS[1]);
      $('#apcModalMainDNS3').val(vm.modal.mainDNS[2]);
      $('#apcModalMainDNS4').val(vm.modal.mainDNS[3]);
      $('#apcModalBackupDNS1').val(vm.modal.backupDNS[0]);
      $('#apcModalBackupDNS2').val(vm.modal.backupDNS[1]);
      $('#apcModalBackupDNS3').val(vm.modal.backupDNS[2]);
      $('#apcModalBackupDNS4').val(vm.modal.backupDNS[3]);

      $('#apcModal').modal('show');
    }

    function serModalShow(param) {
      if (param !== undefined) {
        vm.modal = {
          _id: param._id,
          name: param.name,
          notes: param.notes,
          mode: param.mode,
          mainServer: param.mainServer,
          mainPort: param.mainPort,
          backupServer: param.backupServer,
          backupPort: param.backupPort,
          sms: param.sms,
          hbpInterval: param.hbpInterval,
          maxRandomTime: param.maxRandomTime
        };
        $('#serModalTitle').text('[修改] 服务器连接配置(Server Configuration)');
      } else {
        vm.modal = {
          _id: undefined,
          created: undefined,
          name: '',
          notes: '',
          mode: '2',
          mainServer: '',
          mainPort: '',
          backupServer: '',
          backupPort: '',
          sms: '13888888888',
          hbpInterval: '5',
          maxRandomTime: '0'
        };
        $('#serModalTitle').text('[新增] 服务器连接配置(Server Configuration)');
      }

      $('#serModalName').val(vm.modal.name);
      $('#serModalNotes').val(vm.modal.notes);
      $('#serModalMode').val(vm.modal.mode);
      $('#serModalMainServer').val(vm.modal.mainServer);
      $('#serModalMainPort').val(vm.modal.mainPort);
      $('#serModalBackupServer').val(vm.modal.backupServer);
      $('#serModalBackupPort').val(vm.modal.backupPort);
      $('#serModalSMSGateway').val(vm.modal.sms);
      $('#serModalHbpInterval').val(vm.modal.hbpInterval);
      $('#serModalMaxRandomTime').val(vm.modal.maxRandomTime);

      $('#serModal').modal('show');
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
    function configUpdate(modalName) {
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
        Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 配置信息保存成功!'});
        $('#' + modalName).modal('hide');
        $('#configTable').bootstrapTable('refresh', {url: DevconfigManagementService.apiMap.get(vm.configType)});
      }

      function errorCallback(res) {
        Notification.error({message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> 配置信息保存失败!'});
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
        Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 配置信息删除成功!'});
        $('#configTable').bootstrapTable('refresh', {url: DevconfigManagementService.apiMap.get(vm.configType)});
      }

      function errorCallback(res) {
        Notification.error({message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> 配置信息删除失败!'});
      }
    }

  }
}());
