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
      roles: ['admin', '开发/测试'],
      position: 3
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'upgrades', {
      title: '版本升级',
      state: 'upgrades.batch',
      roles: ['admin', '开发/测试'],
      position: 0
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'upgrades', {
      title: '版本管理',
      state: 'upgrades.versions',
      roles: ['admin', '开发/测试'],
      position: 1
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'upgrades', {
      title: '固件管理',
      state: 'upgrades.version',
      roles: ['admin', '开发/测试'],
      position: 3
    });

  }
}());
