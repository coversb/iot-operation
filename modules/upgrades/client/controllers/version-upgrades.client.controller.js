(function () {
  'use strict';

  angular
    .module('upgrades')
    .controller('UpgradesVersionController', UpgradesListController);

  UpgradesListController.$inject = ['UpgradesService'];

  function UpgradesListController(UpgradesService) {
    var vm = this;

    vm.upgrades = UpgradesService.query();
  }
}());
