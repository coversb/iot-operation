(function () {
  'use strict';

  angular
    .module('upgrades.versions')
    .controller('UpgradesVersionsController', UpgradesVersionsController);

  UpgradesVersionsController.$inject = ['$scope', '$state', '$window', '$http', 'upgradesVersionsResolve', 'Authentication', 'Notification'];

  function UpgradesVersionsController($scope, $state, $window, $http, upgradesVersions, Authentication, Notification) {

    var vm = this;

    vm.version = upgradesVersions;
    vm.txtSearchDevType = '';
    vm.txtSearchVersion = '';
    vm.searchVersion = searchVersion;
    vm.versionUpdate = versionUpdate;

    init();

    function init() {
      // If user is not signed in then redirect back home
      if (!Authentication.user) {
        $state.go('home');
      }
      // switch bootstrap-table'locales to zh-CN
      $.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales['zh-CN']);
      loadVersionList();
    }

    $('#versionUpdateDialog').on('shown.bs.modal', function () {
      $('#fotaBinName').focus();
    });

    function loadVersionList() {
      $('#versionsTable').bootstrapTable({
        method: 'get',
        dataType: 'json',
        contentType: 'application/json',
        url: '/api/upgrades/versions',
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
            devType: vm.txtSearchDevType,
            verNo: vm.txtSearchVersion,
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
            title: '版本名称',
            valign: 'middle',
            align: 'center'
          },
          {
            field: 'devType',
            title: '硬件类型',
            valign: 'middle',
            align: 'center'
          },
          {
            field: 'verNo',
            title: '版本号',
            valign: 'middle',
            align: 'center'
          },
          {
            field: 'url',
            title: 'URL',
            valign: 'middle',
            align: 'center'
          },
          {
            title: '操作',
            field: '_id',
            align: 'center',
            formatter: function (value, row) {
              return [
                '<a href="#" mce_href="#" id="versionSingleEdit">编辑</a> ' +
                '<a href="#" mce_href="#" id="versionSingleDel">删除</a>'
              ];
            },
            events: window.operateEvents = {
              'click #versionSingleEdit': function (e, value, row) {
                editSingleVersion(row);
              },
              'click #versionSingleDel': function (e, value, row) {
                delSingleVersion(row);
              }
            }
          }
        ]
      });
    }


    /* toolbar */
    function searchVersion() {
      $('#versionsTable').bootstrapTable('refresh', {});
    }

    $('#btnAddVersion').click(function () {
      vm.version.name = '';
      vm.version.devType = '';
      vm.version.verNo = '';
      vm.version.md5 = '';
      vm.version.url = '';
      vm.version.retry = '2';
      vm.version.timeout = '2';
      vm.version.protocol = '0';
      vm.version.port = '21';
      vm.version.userName = 'fota';
      vm.version.password = 'fota';
      vm.version.key = '0';
      vm.version.dwnAddr = '0';
      vm.version.bootAddr = '0';
      vm.version._id = null;

      $('#fotaModalTitle').text('新增版本');
      $('#fotaBinName').val('');
      $('#fotaBinURL').val('');
      $('#fotaBinMD5').val('');
      $('#fotaBinDevType').val('');
      $('#fotaBinVerNo').val('');
      $('#fotaRetryTimes').val('2');
      $('#fotaTimeout').val('2');
      $('#fotaProtocol').val('0');
      $('#fotaPort').val('21');
      $('#fotaUserName').val('fota');
      $('#fotaPassword').val('fota');
      $('#fotaKEY').val('0');
      $('#fotaDwnAddr').val('0');
      $('#fotaBootAddr').val('0');

      $('#versionUpdateDialog').modal('show');
    });

    $('#btnDelVersion').click(function () {
      var selectedItem = $('#versionsTable').bootstrapTable('getSelections');

      if (selectedItem.length === 0) {
        alert('请选择需要删除的版本');
      } else {
        if ($window.confirm('确定删除选中的[' + selectedItem.length + ']个版本?')) {
          for (var idx = 0; idx < selectedItem.length; idx++) {
            vm.version._id = selectedItem[idx]._id;
            vm.version.deleteSingle()
              .then(successCallback)
              .catch(errorCallback);
          }
        }
      }

      function successCallback(res) {
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> 版本信息删除成功!' });
        $('#versionsTable').bootstrapTable('refresh', {});
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> 版本信息删除失败!' });
      }
    });

    /* version operation */
    function editSingleVersion(row) {
      vm.version.name = row.name;
      vm.version.devType = row.devType;
      vm.version.verNo = row.verNo;
      vm.version.md5 = row.md5;
      vm.version.url = row.url;
      vm.version.retry = row.retry;
      vm.version.timeout = row.timeout;
      vm.version.protocol = row.protocol;
      vm.version.port = row.port;
      vm.version.userName = row.userName;
      vm.version.password = row.password;
      vm.version.key = row.key;
      vm.version.dwnAddr = row.dwnAddr;
      vm.version.bootAddr = row.bootAddr;
      vm.version._id = row._id;

      $('#fotaModalTitle').text('修改版本');
      $('#fotaBinName').val(vm.version.name);
      $('#fotaBinURL').val(vm.version.url);
      $('#fotaBinMD5').val(vm.version.md5);
      $('#fotaBinDevType').val(vm.version.devType);
      $('#fotaBinVerNo').val(vm.version.verNo);
      $('#fotaRetryTimes').val(vm.version.retry);
      $('#fotaTimeout').val(vm.version.timeout);
      $('#fotaProtocol').val(vm.version.protocol);
      $('#fotaPort').val(vm.version.port);
      $('#fotaUserName').val(vm.version.userName);
      $('#fotaPassword').val(vm.version.password);
      $('#fotaKEY').val(vm.version.key);
      $('#fotaDwnAddr').val(vm.version.dwnAddr);
      $('#fotaBootAddr').val(vm.version.bootAddr);

      $('#versionUpdateDialog').modal('show');
    }

    function delSingleVersion(row) {
      if ($window.confirm('确定删除[' + row.name + ']?')) {
        vm.version._id = row._id;
        vm.version.deleteSingle()
          .then(successCallback)
          .catch(errorCallback);
      }

      function successCallback(res) {
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> 版本信息删除成功!' });
        $('#versionsTable').bootstrapTable('refresh', {});
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> 版本信息删除失败!' });
      }
    }

    function versionUpdate() {
      // Create a new upgrades version, or update the current instance
      vm.version.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> 版本信息保存成功!' });
        $('#versionUpdateDialog').modal('hide');
        $('#versionsTable').bootstrapTable('refresh', {});
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> 版本信息保存失败!' });
      }
    }

  }
}());
