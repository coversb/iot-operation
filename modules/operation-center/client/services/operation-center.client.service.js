(function () {
  'use strict';

  // operation center http service

  angular
    .module('operation-center.service')
    .factory('OperationCenter', OperationCenter);

  OperationCenter.$inject = ['$http'];

  function OperationCenter($http) {
    var operationCenter = {
      httpSendRequest: function (api, data, resCallback) {
        var config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        };

        $http.post(api, $.param(data), config)
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

    return operationCenter;
  }
}());
