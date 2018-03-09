(function () {
  'use strict';

  angular
    .module('upgrades.versions.services')
    .factory('UpgradesVersionsService', UpgradesVersionsService);

  UpgradesVersionsService.$inject = ['$resource', '$log'];

  function UpgradesVersionsService($resource, $log) {
    var UpgradesVersions = $resource('/api/upgrades/versions/:versionsId', {
      versionsId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(UpgradesVersions.prototype, {
      createOrUpdate: function () {
        var version = this;
        return createOrUpdate(version);
      },
      deleteSingle: function () {
        var version = this;
        return deleteSingle(version);
      }
    });

    return UpgradesVersions;

    function deleteSingle(version) {
      if (version._id) {
        return version.$remove(onSuccess, onError);
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

    function createOrUpdate(version) {
      if (version._id) {
        return version.$update(onSuccess, onError);
      } else {
        return version.$save(onSuccess, onError);
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

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
