(function () {
  'use strict';

  angular
    .module('upgrades')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: '升级管理',
      state: 'upgrades',
      type: 'dropdown',
      roles: ['user', 'admin'],
      position: 2
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'upgrades', {
      title: '版本管理',
      state: 'upgrades.versions',
      roles: ['user', 'admin'],
      position: 0
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'upgrades', {
      title: '固件管理',
      state: 'upgrades.version'
    });

  }
}());
