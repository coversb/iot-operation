(function () {
  'use strict';

  angular
    .module('upgrades')
    .controller('UpgradesVersionController', UpgradesListController);

  // UpgradesListController.$inject = ['UpgradesService'];

  function UpgradesListController() {
    var vm = this;

    // vm.upgrades = UpgradesService.query();
  }
}());
