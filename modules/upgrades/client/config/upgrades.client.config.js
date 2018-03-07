(function () {
  'use strict';

  angular
    .module('upgrades')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Upgrades',
      state: 'upgrades',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'upgrades', {
      title: 'Version Manager',
      state: 'upgrades.version'
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'upgrades', {
      title: 'List Upgrades',
      state: 'upgrades.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'upgrades', {
      title: 'Create Upgrade',
      state: 'upgrades.create',
      roles: ['*']
    });
  }
}());
