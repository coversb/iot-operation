(function () {
  'use strict';

  // Upgrades controller
  angular
    .module('upgrades')
    .controller('UpgradesController', UpgradesController);

  UpgradesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'upgradeResolve'];

  function UpgradesController ($scope, $state, $window, Authentication, upgrade) {
    var vm = this;

    vm.authentication = Authentication;
    vm.upgrade = upgrade;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Upgrade
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.upgrade.$remove($state.go('upgrades.list'));
      }
    }

    // Save Upgrade
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.upgradeForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.upgrade._id) {
        vm.upgrade.$update(successCallback, errorCallback);
      } else {
        vm.upgrade.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('upgrades.view', {
          upgradeId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
