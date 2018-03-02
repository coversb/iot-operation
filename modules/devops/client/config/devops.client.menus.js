(function () {
  'use strict';

  angular
    .module('devops')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: '运维工具',
      state: 'devops',
      position: 1
    });
  }
}());
