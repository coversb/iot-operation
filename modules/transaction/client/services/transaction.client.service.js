(function () {
  'use strict';

  angular
    .module('transaction.client.services')
    .factory('TransactionService', TransactionService);

  TransactionService.$inject = ['$http', 'ENV_VARS'];

  function TransactionService($http, ENV_VARS) {
    var apiServerUrl = ENV_VARS.backboneUrl.replace(/iot/, 'api');

    var transactionSettings = {
      // backbone base url
      serverURL: apiServerUrl,
      // API
      availableCityAPI: '/backend/venue_cleaner/list_open_citys ',
      availableBoxAPI: '/backend/venue_cleaner/list_venue',
      cleanerListAPI: '/backend/venue_cleaner/list_venue_cleaner',
      cleanerUpdateAPI: '/backend/venue_cleaner/add_or_update_venue_cleaner',
      cleanerDeleteAPI: '/backend/venue_cleaner/remove_venue_cleaner',
      cleanupListAPI: '/backend/venue_cleaner_work_time/list_venue_cleaner_work_time',
      cleanupUpdateAPI: '/backend/venue_cleaner_work_time/add_or_update_venue_cleaner_work_time',
      cleanupDeleteAPI: '/backend/venue_cleaner_work_time/remove_venue_cleaner_work_time',
      cleanupRecordAPI: '/backend/venue_cleaner_order/list_venue_cleaner_order'
    };

    var transactionService = {
      settings: transactionSettings,
      httpSendRequest: function (api, data, resCallback) {
        var config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        };

        $http.post(this.settings.serverURL + api, $.param(data), config)
          .success(function (data, status) {
            if (resCallback !== undefined) {
              resCallback(data, status);
            }
          })
          .error(function (data, status) {
            if (resCallback !== undefined) {
              resCallback(data, status);
            }
          });

      }
    };

    return transactionService;
  }
}());
