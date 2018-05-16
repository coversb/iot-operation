(function () {
  'use strict';

  angular
    .module('operation-log.service')
    .factory('OperationLogService', OperationLogService);

  OperationLogService.$inject = ['$http', 'Authentication'];

  function OperationLogService($http, Authentication) {
    var operationLogger = {
      trace: function (type, info) {
        var config = {
          headers: {
            'Content-Type': 'application/json'
          }
        };
        var data = {
          type: type,
          info: info,
          user: Authentication.user
        };
        $http.post('/api/operation-log/protocol', data, config)
          .success(function (data, status) {
          })
          .error(function (data, status) {
          });
      }
    };

    return operationLogger;
  }
}());
