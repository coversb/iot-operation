(function () {
  'use strict';

  angular
    .module('devconfig.management.service')
    .factory('DevconfigManagementService', DevconfigManagementService);

  DevconfigManagementService.$inject = ['$resource', '$log'];

  function DevconfigManagementService($resource, $log) {
    var DevconfigManagement = {
      apiMap: new Map([
        ['TV_VOL', '/api/devconfig/tvVolume'], // tv volume
        ['TMP', '/api/devconfig/tmp'], // target temperature setting
        ['APC', '/api/devconfig/apc'],
        ['SER', '/api/devconfig/ser'],
        ['CFG', '/api/devconfig/cfg'],
        ['TMA', '/api/devconfig/tma'],
        ['DOG', '/api/devconfig/dog'],
        ['ACO', '/api/devconfig/aco'],
        ['SEC', '/api/devconfig/sec'],
        ['OMC', '/api/devconfig/omc'],
        ['ACW', '/api/devconfig/acw'],
        ['DOA', '/api/devconfig/doa'],
        ['SMA', '/api/devconfig/sma'],
        ['OUO', '/api/devconfig/ouo'],
        ['OUT', '/api/devconfig/out'],
        ['MUO', '/api/devconfig/muo'],
        ['RTO', '/api/devconfig/rto']
      ]),

      cmdManagerMap: new Map([
        ['TV_VOL', $resource('/api/devconfig/tvVolume/:tvVolume', { tvVolume: '@_id' }, { update: { method: 'PUT' } })],
        ['TMP', $resource('/api/devconfig/tmp/:tmpId', { tmpId: '@_id' }, { update: { method: 'PUT' } })],
        ['APC', $resource('/api/devconfig/apc/:apcId', { apcId: '@_id' }, { update: { method: 'PUT' } })],
        ['SER', $resource('/api/devconfig/ser/:serId', { serId: '@_id' }, { update: { method: 'PUT' } })],
        ['CFG', $resource('/api/devconfig/cfg/:cfgId', { cfgId: '@_id' }, { update: { method: 'PUT' } })],
        ['TMA', $resource('/api/devconfig/tma/:tmaId', { tmaId: '@_id' }, { update: { method: 'PUT' } })],
        ['DOG', $resource('/api/devconfig/dog/:dogId', { dogId: '@_id' }, { update: { method: 'PUT' } })],
        ['ACO', $resource('/api/devconfig/aco/:acoId', { acoId: '@_id' }, { update: { method: 'PUT' } })],
        ['SEC', $resource('/api/devconfig/sec/:secId', { secId: '@_id' }, { update: { method: 'PUT' } })],
        ['OMC', $resource('/api/devconfig/omc/:omcId', { omcId: '@_id' }, { update: { method: 'PUT' } })],
        ['ACW', $resource('/api/devconfig/acw/:acwId', { acwId: '@_id' }, { update: { method: 'PUT' } })],
        ['DOA', $resource('/api/devconfig/doa/:doaId', { doaId: '@_id' }, { update: { method: 'PUT' } })],
        ['SMA', $resource('/api/devconfig/sma/:smaId', { smaId: '@_id' }, { update: { method: 'PUT' } })],
        ['OUO', $resource('/api/devconfig/ouo/:ouoId', { ouoId: '@_id' }, { update: { method: 'PUT' } })],
        ['OUT', $resource('/api/devconfig/out/:outId', { outId: '@_id' }, { update: { method: 'PUT' } })],
        ['MUO', $resource('/api/devconfig/muo/:muoId', { muoId: '@_id' }, { update: { method: 'PUT' } })],
        ['RTO', $resource('/api/devconfig/rto/:rtoId', { rtoId: '@_id' }, { update: { method: 'PUT' } })]
      ])
    };

    DevconfigManagement.cmdManagerMap.forEach(function (value, key, map) {
      if (value !== null) {
        angular.extend(value.prototype, {
          createOrUpdate: function () {
            var cmd = this;
            return createOrUpdate(cmd);
          },
          deleteSingle: function () {
            var cmd = this;
            return deleteSingle(cmd);
          }
        });
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

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
