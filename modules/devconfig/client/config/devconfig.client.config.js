(function () {
  'use strict';

  angular
    .module('devconfig')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: '场馆配置',
      state: 'devconfig',
      type: 'dropdown',
      roles: ['admin', '开发/测试'],
      position: 3
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'devconfig', {
      title: '配置下发',
      state: 'devconfig.configuration',
      roles: ['admin', '开发/测试'],
      position: 0
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'devconfig', {
      title: '配置管理',
      state: 'devconfig.management',
      roles: ['admin', '开发/测试'],
      position: 1
    });

  }
}());
