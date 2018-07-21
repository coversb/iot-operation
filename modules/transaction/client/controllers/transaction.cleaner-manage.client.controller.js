(function () {
  'use strict';

  angular
    .module('transaction.cleaner-manage')
    .controller('TransactionCleanerManageController', TransactionCleanerManageController);

  TransactionCleanerManageController.$inject = ['$scope', '$state', '$window', '$http', 'Authentication', 'Notification', 'TransactionService'];

  function TransactionCleanerManageController($scope, $state, $window, $http, Authentication, Notification, TransactionService) {

    var doSearch = false;
    var cleanerInfoModalOpen = false;
    var cleanrBindModalOpen = false;
    var cleanerListNeedRefresh = false;
    var cleanupDetailNeedRefresh = false;

    var vm = this;
    vm.modalYears = [];
    vm.modalMonths = [];
    vm.modalDays = [];
    vm.modalHours = [];
    vm.modalMinutes = [];
    vm.availableBoxes = [];
    vm.availableProvince = [];
    vm.availableSearchCity = [];
    vm.availableModalCity = [];

    vm.workDay = [
      false,  // 0 Monday
      false,  // 1 Tuesday
      false,  // 2 Wednesday
      false,  // 3 Thursday
      false,  // 4 Friday
      false,  // 5 Saturday
      false,  // 6 Sunday
      false   // 7 Everyday
    ];

    vm.txtSearchCleanerName = '';
    vm.txtSearchCleanerPhone = '';
    vm.txtSearchCleanerProvince = '';
    vm.txtSearchCleanerCity = '';
    vm.txtSearchCleanerBoxName = '';

    vm.workDayUpdateSelection = workDayUpdateSelection;
    vm.searchProvinceChange = searchProvinceChange;
    vm.modalProvinceChange = modalProvinceChange;

    vm.searchCleaner = searchCleaner;
    vm.cleanerInfoUpdate = cleanerInfoUpdate;
    vm.cleanBindUpdate = cleanBindUpdate;

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
      setTimeout(loadCleanersList, 200);
    }

    function createModalElements() {
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

    function workDayUpdateSelection(day) {
      switch (day) {
        case 'everyday': {
          if (vm.workDay[7] === true) {
            vm.workDay[0] = true;
            vm.workDay[1] = true;
            vm.workDay[2] = true;
            vm.workDay[3] = true;
            vm.workDay[4] = true;
            vm.workDay[5] = true;
            vm.workDay[6] = true;
          } else {
            vm.workDay[0] = false;
            vm.workDay[1] = false;
            vm.workDay[2] = false;
            vm.workDay[3] = false;
            vm.workDay[4] = false;
            vm.workDay[5] = false;
            vm.workDay[6] = false;
          }
          break;
        }
        default: {
          if ((vm.workDay[0] && vm.workDay[1] && vm.workDay[2] && vm.workDay[3] && vm.workDay[4] && vm.workDay[5] && vm.workDay[6]) === true) {
            vm.workDay[7] = true;
          } else {
            vm.workDay[7] = false;
          }
          break;
        }
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
      TransactionService.httpSendRequest(TransactionService.settings.availableBoxAPI, data, updateAvailableBoxes);
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
      TransactionService.httpSendRequest(TransactionService.settings.availableCityAPI, data, updateAvailableCity);
    }

    function searchProvinceChange() {
      if (vm.txtSearchCleanerProvince === '') {
        vm.txtSearchCleanerCity = '';
        vm.availableSearchCity = [];
      } else {
        for (var idx in vm.availableProvince) {
          if (vm.availableProvince[idx].provinceId === parseInt(vm.txtSearchCleanerProvince, 10)) {
            vm.txtSearchCleanerCity = '';
            vm.availableSearchCity = vm.availableProvince[idx].cities;
            break;
          }
        }
      }
    }

    function modalProvinceChange() {
      if (vm.modal.province === '') {
        vm.modal.city = '';
        vm.availableModalCity = [];
      } else {
        for (var idx in vm.availableProvince) {
          if (vm.availableProvince[idx].provinceId === parseInt(vm.modal.province, 10)) {
            vm.modal.city = '';
            vm.availableModalCity = vm.availableProvince[idx].cities;
            break;
          }
        }
      }
    }

    // add new cleaner button
    $('#btnAddCleaner').click(function () {
      cleanerInfoModalShow();
    });

    // delete cleaner button
    $('#btnDelCleaner').click(function () {
      var selectedItem = $('#cleanersTable').bootstrapTable('getSelections');
      if (selectedItem.length === 0) {
        alert('请选择需要删除信息');
      } else {
        if ($window.confirm('确定删除选中的[' + selectedItem.length + ']个保洁人员信息?')) {
          var ids = [];
          for (var idx = 0; idx < selectedItem.length; idx++) {
            ids.push(selectedItem[idx].id);
          }
          cleanerInfoDel(ids);
        }
      }
    });

    $('#cleanerInfoModal').on('show.bs.modal', function () {
      cleanerInfoModalOpen = true;
    });
    $('#cleanerInfoModal').on('hide.bs.modal', function () {
      cleanerInfoModalOpen = false;
    });

    $('#cleanrBindModal').on('show.bs.modal', function () {
      cleanrBindModalOpen = true;
    });
    $('#cleanrBindModal').on('hide.bs.modal', function () {
      cleanrBindModalOpen = false;
    });

    function cleanerInfoModalShow(data) {
      if (data === undefined) {
        // added new
        $('#cleanerInfoModalTitle').text('新增保洁人员信息');
        vm.modal = {
          name: '',
          phone: '',
          province: '',
          city: '',
          startYear: '2018',
          startMonth: '1',
          startDay: '1',
          stopYear: '2018',
          stopMonth: '1',
          stopDay: '1'
        };
      } else {
        // modify
        $('#cleanerInfoModalTitle').text('修改保洁人员信息');
        var startDate = new Date(data.contractStartTime);
        var stopDate = new Date(data.contractEndTime);
        vm.modal = {
          id: data.id,
          name: data.truename,
          phone: data.phone,
          province: '',
          city: '',
          startYear: startDate.getFullYear().toString(),
          startMonth: (startDate.getMonth() + 1).toString(),
          startDay: startDate.getDate().toString(),
          stopYear: stopDate.getFullYear().toString(),
          stopMonth: (stopDate.getMonth() + 1).toString(),
          stopDay: stopDate.getDate().toString()
        };
        // update vm.availableModalCity first and then set vm.modal.city value
        vm.modal.province = data.province.toString();
        modalProvinceChange();
        vm.modal.city = data.city.toString();
      }

      $scope.$apply();
      $('#cleanerInfoModal').modal('show');
    }

    function cleanerBindModalShow(parentData, data) {
      vm.workDay = [
        false,  // 0 Monday
        false,  // 1 Tuesday
        false,  // 2 Wednesday
        false,  // 3 Thursday
        false,  // 4 Friday
        false,  // 5 Saturday
        false,  // 6 Sunday
        false   // 7 Everyday
      ];

      if (parentData === null) {
        // added new
        $('#cleanrBindModalTitle').text(data.truename + '(' + convertCityCodeToName(data.city) + ')');
        $('#cleanrBindModalCleaner').removeAttr('readOnly');
        $('#cleanrBindModalCleaner').removeAttr('disabled');
        vm.modal = {
          startHour: '06',
          startMinute: '00',
          stopHour: '07',
          stopMinute: '00',
          userCode: data.userCode
        };
      } else {
        // modify
        $('#cleanrBindModalTitle').text(parentData.truename + '(' + convertCityCodeToName(parentData.city) + ')');
        $('#cleanrBindModalCleaner').attr('readOnly', 'readOnly');
        $('#cleanrBindModalCleaner').attr('disabled', 'disabled');
        vm.modal = {
          cleanupBox: data.venueId.toString(),
          startHour: data.workStartTime.split(':')[0],
          startMinute: data.workStartTime.split(':')[1],
          stopHour: data.workEndTime.split(':')[0],
          stopMinute: data.workEndTime.split(':')[1],
          userCode: data.userCode
        };
        var workDayArray = data.workDay.split(',');
        for (var idx = 0; idx < workDayArray.length; idx++) {
          vm.workDay[parseInt(workDayArray[idx], 10) - 1] = true;
        }
      }
      $scope.$apply();
      $('#cleanrBindModal').modal('show');
    }

    function loadCleanersList() {
      $('#cleanersTable').bootstrapTable({
        method: 'post',
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        url: TransactionService.settings.serverURL + TransactionService.settings.cleanerListAPI,
        striped: true,
        pagination: true, // 是否显示分页
        pageList: [10, 20], // 可供选择的每页的行数（*）
        singleSelect: false,
        pageSize: 1024, // 每页的记录行数
        pageNumber: 1,  // 初始化加载第一页，默认第一页,并记录
        sidePagination: 'server', // 服务端请求
        cache: false,
        showToggle: true,
        showRefresh: true,
        showColumns: true,
        toolbar: '#toolbar',
        detailView: true,
        queryParams: function (params) {  // 配置参数
          var pageNumber = 1;
          /* search parameters */
          var userName = '';
          var phone = '';
          var province = null;
          var city = null;
          var district = null;
          var boxName = '';
          if (doSearch) {
            userName = vm.txtSearchCleanerName;
            phone = vm.txtSearchCleanerPhone;
            province = (vm.txtSearchCleanerProvince === '') ? null : parseInt(vm.txtSearchCleanerProvince, 10);
            city = (vm.txtSearchCleanerCity === '') ? null : parseInt(vm.txtSearchCleanerCity, 10);
            district = null;
            boxName = vm.txtSearchCleanerBoxName;
            doSearch = false;
          } else {
            if (params.offset !== 0 && params.limit !== 0) {
              pageNumber = (params.offset / params.limit) + 1;
            }
          }
          return {
            username: userName,
            phone: phone,
            province: province,
            city: city,
            district: district,
            address: '',
            venueName: boxName,
            limit: params.limit, // 页面大小
            start: pageNumber  // 页码
          };
        },
        responseHandler: function (res) {
          var total = 0;
          var rows = [];
          if (res.code !== 200) {
            alert('加载保洁人员信息失败！' + res.msg + ' code:' + res.code);
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
            field: 'truename',
            title: '姓名',
            valign: 'middle',
            align: 'center'
          },
          {
            field: 'phone',
            title: '电话',
            valign: 'middle',
            align: 'center'
          },
          {
            field: 'city',
            title: '城市',
            valign: 'middle',
            align: 'center',
            formatter: function (value, row) {
              return convertCityCodeToName(value);
            }
          },
          {
            field: 'bindVenue',
            title: '负责场馆',
            valign: 'middle',
            align: 'center',
            formatter: function (value, row) {
              var bindVenues = '';
              for (var idx = 0; idx < value.length; idx++) {
                if (bindVenues !== '') {
                  bindVenues += '<br>';
                }
                bindVenues += value[idx].venueName;
              }
              return bindVenues;
            }
          },
          {
            field: 'contractStartTime',
            title: '合同开始日期',
            valign: 'middle',
            align: 'center',
            formatter: function (value, row) {
              return value.substring(0, 10);
            }
          },
          {
            field: 'contractEndTime',
            title: '合同结束日期',
            valign: 'middle',
            align: 'center',
            formatter: function (value, row) {
              return value.substring(0, 10);
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
                '<a href="#" mce_href="#" id="cleanerSingleDel">删除</a> ' +
                '<a href="#" mce_href="#" id="cleanerBindNewBox">添加盒子</a>'
              ];
            },
            events: window.operateEvents = {
              'click #cleanerSingleEdit': function (e, value, row) {
                cleanerInfoModalShow(row);
              },
              'click #cleanerSingleDel': function (e, value, row) {
                if ($window.confirm('确定删除【' + row.truename + '】？')) {
                  var ids = [];
                  ids.push(row.id);
                  cleanerInfoDel(ids);
                }
              },
              'click #cleanerBindNewBox': function (e, value, row) {
                cleanerBindModalShow(null, row);
              }

            }
          }
        ],
        onExpandRow: function (index, row, $detail) {
          loadCleanupDetails(index, row, $detail);
        }
      });
    }

    function loadCleanupDetails(index, parentRow, $detail) {
      var table = $detail.html('<table class="table table-hover table-striped" id="cleanupDetails"></table>').find('table');
      $(table).bootstrapTable({
        method: 'post',
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        url: TransactionService.settings.serverURL + TransactionService.settings.cleanupListAPI,
        striped: true,
        singleSelect: false,
        sidePagination: 'server', // 服务端请求
        cache: false,
        detailView: true,
        queryParams: function (params) {  // 配置参数
          return {
            userCode: parentRow.userCode
          };
        },
        responseHandler: function (res) {
          var total = 0;
          var rows = [];
          if (res.code !== 200) {
            alert('加载保洁信息失败！' + res.msg + ' code:' + res.code);
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
            field: 'venueName',
            title: '盒子',
            valign: 'middle',
            align: 'center'
          },
          {
            field: 'workDay',
            title: '保洁日',
            valign: 'middle',
            align: 'center',
            formatter: function (value, row) {
              var workDayArray = value.split(',');
              var workday = '';
              if (isWorkEveryday(workDayArray) === true) {
                workday = '每天';
              } else if (isWorkWeekend(workDayArray) === true) {
                workday = '周末';
              } else {
                for (var idx = 0; idx < workDayArray.length; ++idx) {
                  workday += (' ' + convertWorkDay(parseInt(workDayArray[idx], 10)));
                }
              }
              return workday;
            }
          },
          {
            field: 'workStartTime',
            title: '时段',
            valign: 'middle',
            align: 'center',
            formatter: function (value, row) {
              return row.workStartTime + ' --- ' + row.workEndTime;
            }
          },
          {
            title: '操作',
            field: 'id',
            align: 'center',
            formatter: function (value, row) {
              return [
                '<!--a href="#" mce_href="#" id="cleanupBindInfoEdit">编辑</a--> '
                + '<a href="#" mce_href="#" id="cleanupBindDel">删除</a> '
                // + '<a href="#" mce_href="#" id="cleanerSendAllSMS" disabled="disabled">一键补发</a> '
              ];
            },
            events: window.operateEvents = {
              'click #cleanupBindInfoEdit': function (e, value, row) {
                cleanerBindModalShow(parentRow, row);
              },
              'click #cleanupBindDel': function (e, value, row) {
                var queryText = '确定删除【' + row.username + '】对【' + row.venueName + '】的保洁？';
                if ($window.confirm(queryText)) {
                  var cleanupBind = {
                    userCode: row.userCode,
                    venueId: row.venueId,
                    weeks: row.workDay
                  };
                  cleanupBindDel(cleanupBind);
                }
              }
            }
          }
        ],
        onExpandRow: function (index, row, $detail) {
          loadCleanupRecords(index, row, $detail);
        }
      });
    }

    function loadCleanupRecords(index, parentRow, $detail) {
      var table = $detail.html('<table></table>').find('table');
      $(table).bootstrapTable({
        method: 'post',
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        url: TransactionService.settings.serverURL + TransactionService.settings.cleanupRecordAPI,
        pagination: true, // 是否显示分页
        pageList: [10, 20], // 可供选择的每页的行数（*）
        pageSize: 10, // 每页的记录行数
        pageNumber: 1,  // 初始化加载第一页，默认第一页,并记录
        striped: true,
        singleSelect: false,
        sidePagination: 'server', // 服务端请求
        cache: false,
        queryParams: function (params) {  // 配置参数
          // 配置参数
          var pageNumber = 1;
          /* search parameters */
          if (params.offset !== 0 && params.limit !== 0) {
            pageNumber = (params.offset / params.limit) + 1;
          }
          return {
            /*
            username: parentRow.username,
            province: null,
            city: null,
            district: null,
            address: '',
            venueName: parentRow.venueName,
            */
            userCode: parentRow.userCode,
            venueId: parentRow.venueId,
            limit: params.limit, // 页面大小
            start: pageNumber  // 页码
          };
        },
        responseHandler: function (res) {
          var total = 0;
          var rows = [];
          if (res.code !== 200) {
            alert('加载保洁信息失败！' + res.msg + ' code:' + res.code);
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
            field: '',
            title: '保洁日期',
            valign: 'middle',
            align: 'center',
            formatter: function (value, row) {
              return row.startTime.substring(0, 10);
            }
          },
          {
            field: '',
            title: '保洁时段',
            valign: 'middle',
            align: 'center',
            formatter: function (value, row) {
              return row.startTime.substring(11, 19) + ' --- ' + row.endTime.substring(11, 19);
            }
          },
          {
            field: 'code',
            title: '开锁码',
            valign: 'middle',
            align: 'center'
          },
          {
            title: '操作',
            field: 'id',
            align: 'center',
            formatter: function (value, row) {
              return [
                '<a href="#" mce_href="#" id="cleanerSendSMS">补发短信</a> '
              ];
            },
            events: window.operateEvents = {
              'click #cleanerSendSMS': function (e, value, row) {

                var queryText = '确定向【' + row.username + '】'
                  + '补发【' + row.venueName + '】 '
                  + row.startTime.substring(0, 10)
                  + '【' + row.startTime.substring(11, 19)
                  + '---' + row.endTime.substring(11, 19) + '】'
                  + '时段开锁码?';
                if ($window.confirm(queryText)) {
                  cleanupSendSMS(row);
                }
              }
            }
          }
        ]
      });
    }

    /* toolbar */
    function searchCleaner() {
      doSearch = true;
      $('#cleanersTable').bootstrapTable('refresh', {});
    }

    function cleanerInfoUpdate() {
      var data = {
        truename: vm.modal.name,
        username: vm.modal.name,
        phone: vm.modal.phone,
        contractStartTime: vm.modal.startYear + '-' + vm.modal.startMonth + '-' + vm.modal.startDay,
        contractEndTime: vm.modal.stopYear + '-' + vm.modal.stopMonth + '-' + vm.modal.stopDay,
        province: vm.modal.province,
        city: vm.modal.city,
        /* not implement now
        sex
        avatarUrl
        randNum
        idcard
        district
        address
        */
        operator: Authentication.user
      };

      if (vm.modal.id !== undefined) {
        data.id = vm.modal.id;
      }
      cleanerListNeedRefresh = true;
      TransactionService.httpSendRequest(TransactionService.settings.cleanerUpdateAPI, data, showSendRes);
    }

    function cleanerInfoDel(ids) {
      var selectedIds = '';
      for (var idx = 0; idx < ids.length; idx++) {
        if (selectedIds !== '') {
          selectedIds += ',';
        }
        selectedIds += ids[idx].toString();
      }
      var data = {
        ids: selectedIds,
        operator: Authentication.user
      };
      cleanerListNeedRefresh = true;
      TransactionService.httpSendRequest(TransactionService.settings.cleanerDeleteAPI, data, showSendRes);
    }

    function cleanBindUpdate() {
      console.log(vm.modal);
      console.log(vm.workDay);
      var workDay = '';
      for (var idx = 0; idx < 7; idx++) {
        if (vm.workDay[idx] === true) {
          if (workDay !== '') {
            workDay += ',';
          }
          workDay += (idx + 1).toString();
        }
      }
      var data = {
        venueId: vm.modal.cleanupBox,
        weeks: workDay,
        workStartTime: vm.modal.startHour + ':' + vm.modal.startMinute + ':00',
        workEndTime: vm.modal.stopHour + ':' + vm.modal.stopMinute + ':00',
        user: Authentication.user
      };
      if (vm.modal.userCode !== undefined) {
        data.userCode = vm.modal.userCode;
      }
      cleanupDetailNeedRefresh = true;
      TransactionService.httpSendRequest(TransactionService.settings.cleanupUpdateAPI, data, showSendRes);
    }

    function cleanupBindDel(bind) {
      var data = {
        userCode: bind.userCode,
        venueId: bind.venueId,
        weeks: bind.weeks,
        operator: Authentication.user
      };
      cleanupDetailNeedRefresh = true;
      TransactionService.httpSendRequest(TransactionService.settings.cleanupDeleteAPI, data, showSendRes);
    }

    function cleanupSendSMS(data) {
      console.log(data);
    }

    function showSendRes(data, status) {
      if (status !== 200 || data.code !== 200) {
        Notification.error({ message: data.msg, title: '<i class="glyphicon glyphicon-remove"></i> 操作失败! ' });
      } else {
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> 操作成功!' });

        if (cleanerInfoModalOpen === true) {
          $('#cleanerInfoModal').modal('hide');
        } else if (cleanrBindModalOpen === true) {
          $('#cleanrBindModal').modal('hide');

        }

        if (cleanerListNeedRefresh === true) {
          cleanerListNeedRefresh = false;
          $('#cleanersTable').bootstrapTable('refresh', {});
        } else if (cleanupDetailNeedRefresh === true) {
          cleanupDetailNeedRefresh = false;
          $('#cleanupDetails').bootstrapTable('refresh', {});
        }
      }
    }

    function isInArray(array, element) {
      if (array.indexOf(element) === -1) {
        return false;
      }
      return true;
    }

    function isWorkEveryday(data) {
      if (data.length !== 7) {
        return false;
      }
      for (var idx = 0; idx < data.length; idx++) {
        if (isInArray(data, (idx + 1).toString()) === false) {
          return false;
        }
      }
      return true;
    }

    function isWorkWeekend(data) {
      if (data.length !== 2) {
        return false;
      }
      if (isInArray(data, '6') === true && isInArray(data, '7') === true) {
        return true;
      }
      return false;
    }

    function convertWorkDay(data) {
      switch (data) {
        case 1:
          return '周一';
        case 2:
          return '周二';
        case 3:
          return '周三';
        case 4:
          return '周四';
        case 5:
          return '周五';
        case 6:
          return '周六';
        case 7:
          return '周日';
        default:
          return data.toString();
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
      return code;
    }
  }
}());
