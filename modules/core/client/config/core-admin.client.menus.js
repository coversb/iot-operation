(function () {
  'use strict';

  angular
    .module('core.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: '系统管理',
      state: 'admin',
      type: 'dropdown',
      roles: ['admin'],
      position: 100
    });
  }
}());
