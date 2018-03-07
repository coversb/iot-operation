(function () {
  'use strict';

  angular
    .module('upgrades')
    .controller('UpgradesListController', UpgradesListController);

  UpgradesListController.$inject = ['UpgradesService'];

  function UpgradesListController(UpgradesService) {
    var vm = this;

    vm.upgrades = UpgradesService.query();
  }
}());
