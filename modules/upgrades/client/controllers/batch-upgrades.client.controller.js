(function () {
  'use strict';

  angular
    .module('upgrades.batch')
    .controller('UpgradesBatchController', UpgradesBatchController);

  UpgradesBatchController.$inject = ['$scope', '$filter', '$state', '$http', 'Authentication', 'DevopsSettings', 'upgradesBatchResolve', 'Notification'];

  function UpgradesBatchController($scope, $filter, $state, $http, Authentication, DevopsSettings, upgradesVersions, Notification) {

    var searchName = '';
    var softwareVersion = '';
    var deviceType = undefined;
    var vm = this;

    vm.uniqueIds = [];
    vm.availableVersions = upgradesVersions.data;
    vm.version = upgradesVersions.data[0] || {};
    vm.search = search;
    vm.batchUpdate = batchUpdate;

    init();

    function init() {
      // If user is not signed in then redirect back home
      if (!Authentication.user) {
        $state.go('home');
      }
      // switch bootstrap-table'locales to zh-CN
      $.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales['zh-CN']);
      $('#versionUpdateDialog').on('shown.bs.modal', function (e) {
        console.log("event" + e);
        console.dir(e);
        $('#fotaBinName').focus();
      });
      loadBoxList();

      $('#btnAddVersion').click(function () {
        vm.uniqueIds = $('#boxTable').bootstrapTable('getAllSelections').map(function (row) {
          return row.base.uniqueId;
        });
        console.log('getSelections: ' + JSON.stringify(vm.uniqueIds));
        $('#versionUpdateDialog').modal('show');

      });
    }

    // search button
    function search() {
      searchName = vm.searchName;
      softwareVersion = vm.txtSearchVersion;
      deviceType = vm.txtSearchDevType;

      $('#boxTable').bootstrapTable('refresh', {});

      vm.txtSearchVersion = softwareVersion = '';
      vm.searchName = searchName = '';
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
            name: searchName,
            softwareVersion: softwareVersion,
            pageNum: pageNumber,  // 页码
            pageSize: params.limit  // 页面大小
          };

          if(deviceType){
            param.deviceType = deviceType;
          }

          searchName = '';
          vm.searchName = '';
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
          // boxDetail(row.base.uniqueId);
          console.log("uniqueId" + row.base.uniqueId);
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
            field: 'base.deviceType',
            title: '设备类型',
            valign: 'middle',
            align: 'center'
          },
          {
            field: 'base.bootloaderVersion',
            title: 'bootloader版本',
            valign: 'middle',
            align: 'center'
          },
          {
            field: 'base.hardwareVersion',
            title: '固件版本',
            valign: 'middle',
            align: 'center'
          },
          {
            field: 'base.softwareVersion',
            title: '软件版本',
            valign: 'middle',
            align: 'center'
          },
          {
            field: 'base.softwareUpdateStart',
            title: '最近FOTA开始升级',
            valign: 'middle',
            align: 'center',
            formatter: function (value, row) {
              return $filter('date')(value * 1000, 'yyyy-MM-dd HH:mm:ss');
            }
          },
          {
            field: 'base.softwareUpdateEnd',
            title: '最近FOTA结束升级',
            valign: 'middle',
            align: 'center',
            formatter: function (value, row) {
              return $filter('date')(value * 1000, 'yyyy-MM-dd HH:mm:ss');
            }
          },
          {
            title: '更多',
            valign: 'middle',
            align: 'center',
            formatter: function (value, row) {
              return ['<button class="btn btn-default" id="boxUpgrade">升级</button>'];
            },
            events: window.operateEvents = {
              'click #boxUpgrade': function (e, value, row) {
                boxUpgrade(row.base.uniqueId);
              }
            }
          }
        ]
      });
    }

    function batchUpdate() {
      vm.uniqueIds.forEach(sendCmd);
      $('#versionUpdateDialog').modal('hide');
      Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> 版本命令下发成功!'});
    }

    function sendCmd(item, index) {
      fotaSendCmd(item);
    }

    function fotaSendCmd(uniqueId) {
      var cmdObj = {};
      cmdObj.uniqueId = uniqueId;
      cmdObj.messageType = 0x01;
      cmdObj.messageSubType = 0xF1;
      cmdObj.otaCommandRequest = {
        'otaRetryTimes': 2,
        'otaDownloadTimeout': 3, // min
        'otaDownloadProtocol': 0, // must be zero, if you want to upgrade
        'otaServerUrlLength': vm.version.url.trim().length,
        'otaServerUrl': vm.version.url.trim(),
        'otaServerPort': 21,
        'otaServerUsernameLength': "fota".length,
        'otaServerUserName': "fota".trim(),
        'otaServerPasswordLength': "fota".length,
        'otaServerPassword': "fota".trim(),
        'otaServerMD5': vm.version.md5,
        'otaServerKey': 0,
        'otaDownloadAddress': 0,
        'otaAppBootupAddress': 0
      };
      console.log("cmdObj=" + cmdObj);
      console.dir(cmdObj);
      //
      sendCommandToBackend(cmdObj, DevopsSettings.fotaAPI);
    }

    function sendCommandToBackend(data, apiURL) {
      var config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      $http.post(DevopsSettings.backboneURL + apiURL, data, config)
        .success(function (data, status, header, config) {
          console.log('success');
        })
        .error(function (data, status, header, config) {
          console.log('error');
        });
    }

    function boxUpgrade(uid) {

      // getBoxUpgrade(uid);
      vm.uniqueIds = [];
      vm.uniqueIds.push(uid);

      console.log("event uniqueIds=" + vm.uniqueIds + "uid = " + uid);

      vm.selectedVersion = vm.version = upgradesVersions.data[0] || {};
      $('#versionUpdateDialog').modal('show');
    }

    $scope.updateVersion = function (selectedVersion) {

      vm.version = vm.selectedVersion = vm.availableVersions.find(function (v) {
        return v._id === selectedVersion._id;
      });
    };

    function getBoxUpgrade(uid) {
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
  }


}());
