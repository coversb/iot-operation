(function () {
  'use strict';

  angular
    .module('devops.aircon-action')
    .controller('DevopsAirconActionController', DevopsAirconActionController);

  DevopsAirconActionController.$inject = ['$scope', '$state', '$window', '$http', 'Authentication', 'Notification', 'OperationCenterSetting', 'OperationCenter'];

  function DevopsAirconActionController($scope, $state, $window, $http, Authentication, Notification, OperationCenterSetting, OperationCenter) {

    var doSearch = false;

    var vm = this;
    vm.modalYears = [];
    vm.modalMonths = [];
    vm.modalDays = [];
    vm.modalHours = [];
    vm.modalMinutes = [];
    vm.modalSelectedBox = '';
    vm.modalSelectedBoxes = [];
    vm.availableBoxes = [];
    vm.availableProvince = [];
    vm.availableSearchCity = [];
    vm.availableModalCity = [];
    vm.availableBoxTypes = [];

    vm.txtSearchProvince = '';
    vm.txtSearchCity = '';
    vm.txtSearchVenueType = '';
    vm.txtSearchVenueName = '';
    vm.txtSearchActionName = '';

    vm.searchProvinceChange = searchProvinceChange;
    vm.modalProvinceChange = modalProvinceChange;
    vm.modalAddVenue = modalAddVenue;
    vm.modalDelVenue = modalDelVenue;

    vm.searchAirconAction = searchAirconAction;
    vm.actionUpdate = actionUpdate;

    init();

    function init() {
      // If user is not signed in then redirect back home
      if (!Authentication.user) {
        $state.go('home');
      }
      // switch bootstrap-table'locales to zh-CN
      $.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales['zh-CN']);
      requestAvailableBoxes();
      requestAvailableCity();
      createModalElements();
      setTimeout(loadAirconActionsList, 200);
    }

    function createModalElements() {
      // generate box type select options
      vm.availableBoxTypes[0] = {
        typeId: 1,
        typeName: '自主健身舱'
      };
      vm.availableBoxTypes[1] = {
        typeId: 2,
        typeName: '智能健身舱'
      };

      // generate year select options
      var idx = 0;
      var yearMin = 2018;
      var yearMax = 2028;
      for (idx = yearMin; idx <= yearMax; ++idx) {
        vm.modalYears.push(idx.toString());
      }
      // generate month select options
      var monthMin = 1;
      var monthMax = 12;
      for (idx = monthMin; idx <= monthMax; ++idx) {
        vm.modalMonths.push(idx.toString());
      }
      // generate day select options
      var dayMin = 1;
      var dayMax = 31;
      for (idx = dayMin; idx <= dayMax; ++idx) {
        vm.modalDays.push(idx.toString());
      }

      var hourMin = 0;
      var hourMax = 23;
      for (idx = hourMin; idx <= hourMax; ++idx) {
        var hour = idx.toString();
        if (idx < 10) {
          hour = '0' + hour;
        }
        vm.modalHours.push(hour);
      }
      // generate minute select options
      var minuteMin = 0;
      var minuteMax = 59;
      for (idx = minuteMin; idx <= minuteMax; ++idx) {
        var minute = idx.toString();
        if (idx < 10) {
          minute = '0' + minute;
        }
        vm.modalMinutes.push(minute);
      }
    }

    function updateAvailableBoxes(data, status) {
      if (status !== 200 || data.code !== 200) {
        Notification.error({ message: data.msg, title: '<i class="glyphicon glyphicon-remove"></i> 加载盒子失败! ' });
      } else {
        vm.availableBoxes = [];
        for (var idx = 0; idx < data.data.length; ++idx) {
          vm.availableBoxes[idx] = {
            venueId: data.data[idx].vid,
            venueName: data.data[idx].name
          };
        }
      }
    }

    function requestAvailableBoxes() {
      var data = {
        start: 1,
        limit: 1024
      };
      OperationCenter.httpSendRequest(OperationCenterSetting.apiURL + OperationCenterSetting.availableBoxAPI, data, updateAvailableBoxes);
    }

    function updateAvailableCity(data, status) {
      if (status !== 200 || data.code !== 200) {
        Notification.error({ message: data.msg, title: '<i class="glyphicon glyphicon-remove"></i> 加载城市! ' });
      } else {
        vm.availableProvince = [];
        for (var provinceIdx = 0; provinceIdx < data.data.length; ++provinceIdx) {
          var cities = [];
          for (var cityIdx = 0; cityIdx < data.data[provinceIdx].children.length; ++cityIdx) {
            cities[cityIdx] = {
              cityId: data.data[provinceIdx].children[cityIdx].id,
              cityName: data.data[provinceIdx].children[cityIdx].areaName
            };
          }

          vm.availableProvince[provinceIdx] = {
            provinceId: data.data[provinceIdx].id,
            provinceName: data.data[provinceIdx].areaName,
            cities: cities
          };
        }
      }
    }

    function requestAvailableCity() {
      var data = {};
      OperationCenter.httpSendRequest(OperationCenterSetting.apiURL + OperationCenterSetting.availableCityAPI, data, updateAvailableCity);
    }

    function searchProvinceChange() {
      if (vm.txtSearchProvince === '') {
        vm.txtSearchCity = '';
        vm.availableSearchCity = [];
      } else {
        for (var idx in vm.availableProvince) {
          if (vm.availableProvince[idx].provinceId === parseInt(vm.txtSearchProvince, 10)) {
            vm.txtSearchCity = '';
            vm.availableSearchCity = vm.availableProvince[idx].cities;
            break;
          }
        }
      }
    }

    function modalProvinceChange() {
      if (vm.modal.provinceId === '') {
        vm.modal.cityId = '';
        vm.availableModalCity = [];
      } else {
        for (var idx in vm.availableProvince) {
          if (vm.availableProvince[idx].provinceId === parseInt(vm.modal.provinceId, 10)) {
            vm.modal.cityId = '';
            vm.availableModalCity = vm.availableProvince[idx].cities;
            break;
          }
        }
      }
    }

    function modalAddVenue() {
      var selectedVenueName = convertVenueIdToName(vm.modalSelectedBox);
      if (selectedVenueName !== '') {
        var selectedVenue = {
          id: parseInt(vm.modalSelectedBox, 10),
          name: selectedVenueName
        };
        if (modalAddVenueValidity(selectedVenue.id)) {
          vm.modalSelectedBoxes.push(selectedVenue);
        }
      } else {
        alert('请选择正确的场馆');
      }
    }

    function modalAddVenueValidity(id) {
      for (var idx = 0; idx < vm.modalSelectedBoxes.length; idx++) {
        if (vm.modalSelectedBoxes[idx].id === id) {
          return false;
        }
      }
      return true;
    }

    function modalDelVenue(idx) {
      vm.modalSelectedBoxes.splice(idx, 1);
    }

    // add new action button
    $('#btnAddAction').click(function () {
      actionModalShow();
    });

    // delete action button
    $('#btnDelAction').click(function () {
      var selectedItem = $('#airconActionsTable').bootstrapTable('getSelections');
      if (selectedItem.length === 0) {
        alert('请选择需要删除信息');
      } else {
        if ($window.confirm('确定删除选中的[' + selectedItem.length + ']个空调任务?')) {
          var ids = [];
          for (var idx = 0; idx < selectedItem.length; idx++) {
            ids.push(selectedItem[idx].id);
          }
          actionDel(ids);
        }
      }
    });

    function loadAirconActionsList() {
      $('#airconActionsTable').bootstrapTable({
        method: 'post',
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        url: OperationCenterSetting.apiURL + OperationCenterSetting.airconActionListAPI,
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
          /* search parameters */
          var actionName = '';
          var cityId = null;
          var venueName = '';
          var venueType = null;
          if (doSearch) {
            actionName = vm.txtSearchActionName;
            cityId = (vm.txtSearchCity === '') ? null : parseInt(vm.txtSearchCity, 10);
            venueName = vm.txtSearchVenueName;
            venueType = (vm.txtSearchVenueType === '') ? null : parseInt(vm.txtSearchVenueType, 10);
            doSearch = false;
          } else {
            if (params.offset !== 0 && params.limit !== 0) {
              pageNumber = (params.offset / params.limit) + 1;
            }
          }
          return {
            actionName: actionName,
            cityId: cityId,
            venueName: venueName,
            venueType: venueType,
            limit: params.limit, // 页面大小
            start: pageNumber  // 页码
          };
        },
        responseHandler: function (res) {
          var total = 0;
          var rows = [];
          if (res.code !== 200) {
            alert('加载空调任务信息失败！' + res.msg + ' code:' + res.code);
          } else {
            total = res.total;
            rows = res.data;
          }
          return {
            'total': total,
            'rows': rows
          };
        },
        // table headers
        columns: [
          {
            checkbox: true
          },
          {
            field: 'actionName',
            title: '名称',
            valign: 'middle',
            align: 'center'
          },
          {
            field: 'cityId',
            title: '城市',
            valign: 'middle',
            align: 'center',
            formatter: function (value, row) {
              return convertCityCodeToName(value);
            }
          },
          {
            field: 'venueType',
            title: '场馆类型',
            valign: 'middle',
            align: 'center',
            formatter: function (value, row) {
              var venueType = '全部';
              switch (value) {
                case 1: {
                  venueType = '自主健身舱';
                  break;
                }
                case 2: {
                  venueType = '智能健身舱';
                  break;
                }
                default: break;
              }
              return venueType;
            }
          },
          {
            field: 'venueName',
            title: '场馆',
            valign: 'middle',
            align: 'center',
            formatter: function (value, row) {
              if (value === null) {
                return '全部';
              } else {
                return value;
              }
            }
          },
          {
            field: 'powerMode',
            title: '供电·模式·风量·温度',
            valign: 'middle',
            align: 'center',
            formatter: function (value, row) {
              var pwrMode = '-';
              var workMode = '-';
              var windMode = '-';
              var temperature = '-';
              // power mode
              switch (row.powerMode) {
                case 0: {
                  pwrMode = '关';
                  break;
                }
                case 1: {
                  pwrMode = '开';
                  break;
                }
                default: break;
              }
              // work mode
              switch (row.workMode) {
                case 0: {
                  workMode = '制冷';
                  break;
                }
                case 1: {
                  workMode = '制热';
                  break;
                }
                case 2: {
                  workMode = '送风';
                  break;
                }
                case 3: {
                  workMode = '抽湿';
                  break;
                }
                default: break;
              }
              // wind level
              switch (row.windPower) {
                case 0: {
                  windMode = '高';
                  break;
                }
                case 1: {
                  windMode = '中';
                  break;
                }
                case 2: {
                  windMode = '低';
                  break;
                }
                case 3: {
                  windMode = '自动';
                  break;
                }
                default: break;
              }

              if (row.temperature !== 0) {
                temperature = row.temperature;
              }
              return '<span>' + pwrMode + '|' + workMode + '|' + windMode + '|' + temperature + '</span>';
            }
          },
          {
            field: 'actionDate',
            title: '执行日期',
            valign: 'middle',
            align: 'center',
            formatter: function (value, row) {
              if (value === '') {
                return '每天';
              } else {
                return value;
              }
            }
          },
          {
            field: 'actionTime',
            title: '执行时刻',
            valign: 'middle',
            align: 'center'
          },
          {
            field: 'isValid',
            title: '状态',
            valign: 'middle',
            align: 'center',
            formatter: function (value, row) {
              var validState = '<span style="color:red"> 未知 </span>';
              switch (value) {
                case 0: {
                  validState = '<span style="color:red"> 停止 </span>';
                  break;
                }
                case 1: {
                  validState = '<span style="color:green"> 运行中 </span>';
                  break;
                }
                default: break;
              }
              return validState;
            }
          },
          {
            field: 'createTime',
            title: '添加时间',
            valign: 'middle',
            align: 'center'
          },
          {
            title: '操作',
            field: 'id',
            align: 'center',
            formatter: function (value, row) {
              return [
                '<a href="#" mce_href="#" id="cleanerSingleEdit">编辑</a> ' +
                '<a href="#" mce_href="#" id="cleanerSingleDel">删除</a> '
              ];
            },
            events: window.operateEvents = {
              'click #cleanerSingleEdit': function (e, value, row) {
                actionModalShow(row);
              },
              'click #cleanerSingleDel': function (e, value, row) {
                if ($window.confirm('确定删除【' + row.actionName + '】？')) {
                  var ids = [];
                  ids.push(row.id);
                  actionDel(ids);
                }
              }
            }
          }
        ]
      });
    }

    /* toolbar */
    function searchAirconAction() {
      doSearch = true;
      $('#airconActionsTable').bootstrapTable('refresh', {});
    }

    function actionModalShow(data) {
      // clear temp data
      vm.modalSelectedBox = '';
      vm.modalSelectedBoxes = [];
      if (data === undefined) {
        // added new
        $('#actionModalTitle').text('新增空调任务');
        vm.modal = {
          actionName: '',
          provinceId: '',
          cityId: '',
          venueType: '',
          actionVenueCondition: 'all',
          venueIds: '',
          // action date-time
          actionDateCondition: 'everyDay',
          actionYear: '2018',
          actionMonth: '1',
          actionDay: '1',
          actionHour: '06',
          actionMinute: '00',
          actionSecond: '00',
          // mode
          powerMode: '1',
          workMode: '2',
          windPower: '3',
          temperature: '20',
          isValid: '0'
        };
      } else {
        // modify
        $('#actionModalTitle').text('修改空调任务');
        vm.modal = {
          id: data.id,
          actionName: data.actionName,
          provinceId: '',
          cityId: '',
          venueType: '',
          actionVenueCondition: 'all',
          venueIds: data.venueIds,
          // action date-time
          actionDateCondition: 'everyDay',
          actionYear: '2018',
          actionMonth: '1',
          actionDay: '1',
          actionHour: data.actionTime.split(':')[0],
          actionMinute: data.actionTime.split(':')[1],
          actionSecond: data.actionTime.split(':')[2],
          // mode
          powerMode: data.powerMode.toString(10),
          workMode: data.workMode.toString(10),
          windPower: data.windPower.toString(10),
          temperature: data.temperature.toString(10),
          isValid: data.isValid.toString(10)
        };
        // update actionDate
        if (data.actionDate !== '') {
          var actionDate = new Date(data.actionDate);
          vm.modal.actionDateCondition = 'setDay';
          vm.modal.actionYear = actionDate.getFullYear().toString(10);
          vm.modal.actionMonth = (actionDate.getMonth() + 1).toString(10);
          vm.modal.actionDay = actionDate.getDate().toString(10);
        }
        // update province and city
        if (data.cityId !== null) {
          vm.modal.provinceId = findProvinceByCityId(data.cityId);
          modalProvinceChange();
          vm.modal.cityId = data.cityId.toString(10);
        }
        // update venue type
        if (data.venueType !== null) {
          vm.modal.venueType = data.venueType.toString(10);
        }
        // update selected venue
        if (data.venueId !== null) {
          vm.modal.actionVenueCondition = 'selected';
          vm.modalSelectedBox = data.venueId.toString(10);

          var selectedVenueName = convertVenueIdToName(vm.modalSelectedBox);
          if (selectedVenueName !== '') {
            var selectedVenue = {
              id: parseInt(vm.modalSelectedBox, 10),
              name: selectedVenueName
            };
            if (modalAddVenueValidity(selectedVenue.id)) {
              vm.modalSelectedBoxes.push(selectedVenue);
            }
          }
        }
      }

      $scope.$apply();
      $('#actionModal').modal('show');
    }

    function actionUpdate() {
      var actionDate = '';
      var venueIds = '';
      if (vm.modal.actionDateCondition === 'setDay') {
        actionDate = vm.modal.actionYear + '-' + vm.modal.actionMonth + '-' + vm.modal.actionDay;
      }
      if (vm.modal.actionVenueCondition === 'selected') {
        venueIds = convertModalSelectedBoxedToString();
      }
      var cityId = null;
      if (vm.modal.cityId !== '') {
        cityId = parseInt(vm.modal.cityId, 10);
      }
      var venueType = null;
      if (vm.modal.venueType !== '') {
        venueType = parseInt(vm.modal.venueType, 10);
      }
      var data = {
        actionName: vm.modal.actionName,
        // city
        cityId: cityId,
        // venue
        venueType: venueType,
        venueIds: venueIds,
        // action date time
        actionDate: actionDate,
        actionTime: vm.modal.actionHour + ':' + vm.modal.actionMinute + ':' + vm.modal.actionSecond,
        // air-conditioner mode
        powerMode: parseInt(vm.modal.powerMode, 10),
        workMode: parseInt(vm.modal.workMode, 10),
        windPower: parseInt(vm.modal.windPower, 10),
        temperature: parseInt(vm.modal.temperature, 10),
        isValid: parseInt(vm.modal.isValid, 10),
        operator: Authentication.user
      };

      if (vm.modal.id !== undefined) {
        data.id = vm.modal.id;
      }
      OperationCenter.httpSendRequest(OperationCenterSetting.apiURL + OperationCenterSetting.airconActionUpdateAPI, data, showSendRes);
    }

    function convertModalSelectedBoxedToString() {
      var selectedIds = '';
      if (vm.modalSelectedBoxes.length !== 0) {
        for (var idx = 0; idx < vm.modalSelectedBoxes.length; idx++) {
          if (selectedIds !== '') {
            selectedIds += ',';
          }
          selectedIds += vm.modalSelectedBoxes[idx].id.toString();
        }
      }

      return selectedIds;
    }

    function actionDel(ids) {
      var singleId = null;
      var selectedIds = '';
      if (ids.length > 1) {
        for (var idx = 0; idx < ids.length; idx++) {
          if (selectedIds !== '') {
            selectedIds += ',';
          }
          selectedIds += ids[idx].toString();
        }
      } else {
        singleId = ids[0];
      }
      var data = {
        id: singleId,
        ids: selectedIds,
        operator: Authentication.user
      };
      OperationCenter.httpSendRequest(OperationCenterSetting.apiURL + OperationCenterSetting.airconActionDeleteAPI, data, showSendRes);
    }

    function showSendRes(data, status) {
      if (status !== 200 || data.code !== 200) {
        Notification.error({ message: data.msg, title: '<i class="glyphicon glyphicon-remove"></i> 操作失败! ' });
      } else {
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> 操作成功!' });

        $('#actionModal').modal('hide');
        $('#airconActionsTable').bootstrapTable('refresh', {});
      }
    }

    function convertCityCodeToName(code) {
      for (var provinceIdx = 0; provinceIdx < vm.availableProvince.length; ++provinceIdx) {
        for (var cityIdx = 0; cityIdx < vm.availableProvince[provinceIdx].cities.length; ++cityIdx) {
          if (parseInt(code, 10) === vm.availableProvince[provinceIdx].cities[cityIdx].cityId) {
            return vm.availableProvince[provinceIdx].cities[cityIdx].cityName;
          }
        }
      }

      if (code == null) {
        return '全部';
      }

      return code;
    }

    function convertVenueIdToName(id) {
      for (var idx = 0; idx < vm.availableBoxes.length; idx++) {
        if (parseInt(id, 10) === vm.availableBoxes[idx].venueId) {
          return vm.availableBoxes[idx].venueName;
        }
      }

      return '';
    }

    function findProvinceByCityId(cityId) {
      for (var provinceIdx = 0; provinceIdx < vm.availableProvince.length; ++provinceIdx) {
        for (var cityIdx = 0; cityIdx < vm.availableProvince[provinceIdx].cities.length; ++cityIdx) {
          if (parseInt(cityId, 10) === vm.availableProvince[provinceIdx].cities[cityIdx].cityId) {
            return vm.availableProvince[provinceIdx].provinceId.toString(10);
          }
        }
      }
    }
  }
}());
