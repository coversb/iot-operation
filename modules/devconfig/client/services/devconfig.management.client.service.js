(function () {
  'use strict';

  angular
    .module('devconfig.management.service')
    .factory('DevconfigManagementService', DevconfigManagementService);

  DevconfigManagementService.$inject = ['$resource', '$log'];

  function DevconfigManagementService($resource, $log) {
    var DevconfigManagement = {
      apiMap: new Map([
        ['APC', '/api/devconfig/apc'],
        ['SER', '/api/devconfig/ser'],
        ['CFG', '/api/devconfig/cfg'],
        ['TMA', '/api/devconfig/tma'],
        ['DOG', '/api/devconfig/dog'],
        ['ACO', '/api/devconfig/aco'],
        ['SEC', '/api/devconfig/sec'],
        ['OMC', '/api/devconfig/omc'],
        ['DOA', '/api/devconfig/doa'],
        ['SMA', '/api/devconfig/sma'],
        ['OUO', '/api/devconfig/ouo'],
        ['OUT', '/api/devconfig/out'],
        ['MUO', '/api/devconfig/muo'],
        ['RTO', '/api/devconfig/rto']
      ]),

      apcCommand: $resource('/api/devconfig/apc/:apcId', {
        apcId: '@_id'
      }, {
        update: {
          method: 'PUT'
        }
      }),
      serCommand: $resource('/api/devconfig/ser/:serId', {
        serId: '@_id'
      }, {
        update: {
          method: 'PUT'
        }
      }),
      cfgCommand: $resource('/api/devconfig/cfg/:cfgId', {
        cfgId: '@_id'
      }, {
        update: {
          method: 'PUT'
        }
      }),
      tmaCommand: $resource('/api/devconfig/tma/:tmaId', {
        tmaId: '@_id'
      }, {
        update: {
          method: 'PUT'
        }
      })
    };

    angular.extend(DevconfigManagement.apcCommand.prototype, {
      createOrUpdate: function () {
        var cmd = this;
        return createOrUpdate(cmd);
      },
      deleteSingle: function () {
        var cmd = this;
        return deleteSingle(cmd);
      }
    });

    angular.extend(DevconfigManagement.serCommand.prototype, {
      createOrUpdate: function () {
        var cmd = this;
        return createOrUpdate(cmd);
      },
      deleteSingle: function () {
        var cmd = this;
        return deleteSingle(cmd);
      }
    });

    angular.extend(DevconfigManagement.cfgCommand.prototype, {
      createOrUpdate: function () {
        var cmd = this;
        return createOrUpdate(cmd);
      },
      deleteSingle: function () {
        var cmd = this;
        return deleteSingle(cmd);
      }
    });

    angular.extend(DevconfigManagement.tmaCommand.prototype, {
      createOrUpdate: function () {
        var cmd = this;
        return createOrUpdate(cmd);
      },
      deleteSingle: function () {
        var cmd = this;
        return deleteSingle(cmd);
      }
    });

    return DevconfigManagement;

    function deleteSingle(cmd) {
      if (cmd._id) {
        return cmd.$remove(onSuccess, onError);
      }
      // Handle successful response
      function onSuccess(version) {
        // Any required internal processing from inside the service, goes here.
      }
      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }
    function createOrUpdate(cmd) {
      if (cmd._id) {
        return cmd.$update(onSuccess, onError);
      } else {
        return cmd.$save(onSuccess, onError);
      }
      // Handle successful response
      function onSuccess(cmd) {
        // Any required internal processing from inside the service, goes here.
      }
      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }
    /* APC end */

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
