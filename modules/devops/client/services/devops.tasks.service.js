(function () {
  'use strict';

  // DevopsProt service for devops

  angular
    .module('devops.tasks.services')
    .factory('DevopsTasks', DevopsTasks);

  var PROTVER = '0114'; // protocol version V1.20
  var PROTDEVTYPE = '01'; // device type
  var PROTSTART = '2B5042'; // protocol starter '+PB'
  var PROTTAIL = '0D0A';

  DevopsTasks.$inject = ['$http', 'DevopsSettings'];

  function DevopsTasks($http, DevopsSettings) {
    var task = {
      settings: DevopsSettings,
      httpSendRequest: function (api, data, resCallback) {
        var config = {
          headers: {
            'Content-Type': 'application/json'
          }
        };

        $http.post(DevopsSettings.backboneURL + api, data, config)
          .success(function (data, status) {
            if (resCallback !== undefined) {
              resCallback(data, status);
            }
          })
          .error(function (data, status) {
            // console.log('error');
            if (resCallback !== undefined) {
              resCallback(data, status);
            }
          });

      },

      addTask: function (api, data, resCallback) {
        var config = {
          headers: {
            'Content-Type': 'application/json'
          }
        };

        $http.post(api, data, config)
          .success(function (data, status) {
            if (resCallback !== undefined) {
              resCallback(data, status);
            }
          })
          .error(function (data, status) {
            // console.log('error');
            if (resCallback !== undefined) {
              resCallback(data, status);
            }
          });

      }
    };

    return task;
  }


}());
