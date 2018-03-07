// Upgrades service used to communicate Upgrades REST endpoints
(function () {
  'use strict';

  angular
    .module('upgrades')
    .factory('UpgradesService', UpgradesService);

  UpgradesService.$inject = ['$resource'];

  function UpgradesService($resource) {
    return $resource('api/upgrades/:upgradeId', {
      upgradeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
