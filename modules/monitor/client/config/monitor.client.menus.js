(function () {
  'use strict';

  angular
    .module('monitor')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: '场馆监控',
      state: 'monitor',
      roles: ['user', 'admin'],
      position: 0
    });
  }
}());
