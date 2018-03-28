(function () {
  'use strict';

  angular
    .module('devconfig.management')
    .controller('DevconfigManagementController', DevconfigManagementController);

  DevconfigManagementController.$inject = ['$scope', '$state', '$window', '$http', 'Authentication', 'Notification', 'DevconfigManagementService',
    'devconfigApcResolve', 'devconfigSerResolve'];

  function DevconfigManagementController($scope, $state, $window, $http, Authentication, Notification, DevconfigManagementService,
                                         devconfigApc, devconfigSer) {

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

    $('#versionUpdateDialog').on('shown.bs.modal', function () {

    });

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
        var mainDNS = param.mainDNS.split('.');
        var backupDNS = param.backupDNS.split('.');
        vm.apcModal = {
          _id: param._id,
          name: param.name,
          notes: param.notes,
          apn: param.apn,
          userName: param.userName,
          password: param.password,
          mainDNS1: mainDNS[0],
          mainDNS2: mainDNS[1],
          mainDNS3: mainDNS[2],
          mainDNS4: mainDNS[3],
          backupDNS1: backupDNS[0],
          backupDNS2: backupDNS[0],
          backupDNS3: backupDNS[0],
          backupDNS4: backupDNS[0]
        };
        $('#apcModalTitle').text('[修改] 入网配置(Access Point Configuration)');
      } else {
        vm.apcModal = {
          name: '',
          notes: '',
          apn: '',
          userName: '',
          password: '',
          mainDNS1: '114',
          mainDNS2: '114',
          mainDNS3: '114',
          mainDNS4: '114',
          backupDNS1: '114',
          backupDNS2: '114',
          backupDNS3: '114',
          backupDNS4: '114'
        };
        $('#apcModalTitle').text('[新增] 入网配置(Access Point Configuration)');
      }

      $('#apcModalName').val(vm.apcModal.name);
      $('#apcModalNotes').val(vm.apcModal.notes);
      $('#apcModalAPN').val(vm.apcModal.apn);
      $('#apcModalAPNUserName').val(vm.apcModal.userName);
      $('#apcModalAPNPassword').val(vm.apcModal.password);
      $('#apcModalMainDNS1').val(vm.apcModal.mainDNS1);
      $('#apcModalMainDNS2').val(vm.apcModal.mainDNS2);
      $('#apcModalMainDNS3').val(vm.apcModal.mainDNS3);
      $('#apcModalMainDNS4').val(vm.apcModal.mainDNS4);
      $('#apcModalBackupDNS1').val(vm.apcModal.backupDNS1);
      $('#apcModalBackupDNS2').val(vm.apcModal.backupDNS2);
      $('#apcModalBackupDNS3').val(vm.apcModal.backupDNS3);
      $('#apcModalBackupDNS4').val(vm.apcModal.backupDNS4);

      $('#apcModal').modal('show');
    }

    function serModalShow(param) {
      if (param !== undefined) {
        vm.serModal = {
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
        vm.serModal = {
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

      $('#serModalName').val(vm.serModal.name);
      $('#serModalNotes').val(vm.serModal.notes);
      $('#serModalMode').val(vm.serModal.mode);
      $('#serModalMainServer').val(vm.serModal.mainServer);
      $('#serModalMainPort').val(vm.serModal.mainPort);
      $('#serModalBackupServer').val(vm.serModal.backupServer);
      $('#serModalBackupPort').val(vm.serModal.backupPort);
      $('#serModalSMSGateway').val(vm.serModal.sms);
      $('#serModalHbpInterval').val(vm.serModal.hbpInterval);
      $('#serModalMaxRandomTime').val(vm.serModal.maxRandomTime);

      $('#serModal').modal('show');
    }

    // 批量删除
    $('#btnDelConfig').click(function () {
      var selectedItem = $('#configTable').bootstrapTable('getSelections');

      if (selectedItem.length === 0) {
        alert('请选择需要删除的版本');
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

      switch (vm.configType) {
        case 'APC': {
          devconfigApc._id = vm.apcModal._id;
          devconfigApc.name = vm.apcModal.name;
          devconfigApc.notes = vm.apcModal.notes;
          devconfigApc.apn = vm.apcModal.apn;
          devconfigApc.userName = vm.apcModal.userName;
          devconfigApc.password = vm.apcModal.password;
          devconfigApc.mainDNS = vm.apcModal.mainDNS1 + '.' + vm.apcModal.mainDNS2 + '.' + vm.apcModal.mainDNS3 + '.' + vm.apcModal.mainDNS4;
          devconfigApc.backupDNS = vm.apcModal.backupDNS1 + '.' + vm.apcModal.backupDNS2 + '.' + vm.apcModal.backupDNS3 + '.' + vm.apcModal.backupDNS4;
          devconfigApc.createOrUpdate()
            .then(successCallback)
            .catch(errorCallback);
          break;
        }
        case 'SER':{
          devconfigSer._id = vm.serModal._id;
          devconfigSer.name = vm.serModal.name;
          devconfigSer.notes = vm.serModal.notes;
          devconfigSer.mode = vm.serModal.mode;
          devconfigSer.mainServer = vm.serModal.mainServer;
          devconfigSer.mainPort = vm.serModal.mainPort;
          devconfigSer.backupServer = vm.serModal.backupServer;
          devconfigSer.backupPort = vm.serModal.backupPort;
          devconfigSer.sms = vm.serModal.sms;
          devconfigSer.hbpInterval = vm.serModal.hbpInterval;
          devconfigSer.maxRandomTime = vm.serModal.maxRandomTime;
          devconfigSer.createOrUpdate()
            .then(successCallback)
            .catch(errorCallback);
        }
        default:
          break;
      }


      function successCallback(res) {
        Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 版本信息保存成功!'});
        $('#' + modalName).modal('hide');
        $('#configTable').bootstrapTable('refresh', {url: DevconfigManagementService.apiMap.get(vm.configType)});
      }

      function errorCallback(res) {
        Notification.error({message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> 版本信息保存失败!'});
      }
    }

    // delete single config
    function configDeleteSingle(id) {
      switch (vm.configType) {
        case 'APC': {
          devconfigApc._id = id;
          devconfigApc.deleteSingle()
            .then(successCallback)
            .catch(errorCallback);
          break;
        }
        case 'SER': {
          devconfigSer._id = id;
          devconfigSer.deleteSingle()
            .then(successCallback)
            .catch(errorCallback);
          break;
        }
        default:
          break;
      }

      function successCallback(res) {
        Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 版本信息删除成功!'});
        $('#configTable').bootstrapTable('refresh', {url: DevconfigManagementService.apiMap.get(vm.configType)});
      }

      function errorCallback(res) {
        Notification.error({message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> 版本信息删除失败!'});
      }
    }

  }
}());
