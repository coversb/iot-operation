(function () {
  'use strict';

  angular
    .module('devops')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: '场馆控制',
      state: 'devops',
      type: 'dropdown',
      roles: ['user', 'admin'],
      position: 1
    });

    menuService.addSubMenuItem('topbar', 'devops', {
      title: '运维工具',
      state: 'devops.tools',
      roles: ['user', 'admin'],
      position: 0
    });

    menuService.addSubMenuItem('topbar', 'devops', {
      title: '功能测试工具',
      state: 'devops.functiontest',
      roles: ['user', 'admin'],
      position: 1
    });

    menuService.addSubMenuItem('topbar', 'devops', {
      title: '协议命令',
      state: 'devops.protcmd',
      roles: ['admin'],
      position: 99
    });
  }
}());
