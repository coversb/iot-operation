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
      })
    };

    angular.extend(DevconfigManagement.apcCommand.prototype, {
      createOrUpdate: function () {
        var apcCommand = this;
        return createOrUpdate(apcCommand);
      },
      deleteSingle: function () {
        var apcCommand = this;
        return deleteSingle(apcCommand);
      }
    });

    return DevconfigManagement;

    /* APC begin */
    function deleteSingle(apc) {
      if (apc._id) {
        return apc.$remove(onSuccess, onError);
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
    function createOrUpdate(apc) {
      if (apc._id) {
        console.log(apc);
        return apc.$update(onSuccess, onError);
      } else {
        return apc.$save(onSuccess, onError);
      }
      // Handle successful response
      function onSuccess(apc) {
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
