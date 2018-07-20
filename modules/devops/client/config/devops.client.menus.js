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
      roles: ['admin', '运维/客服/工程', '开发/测试'],
      position: 1
    });

    menuService.addSubMenuItem('topbar', 'devops', {
      title: '运维工具',
      state: 'devops.tools',
      roles: ['admin', '运维/客服/工程', '开发/测试'],
      position: 0
    });

    menuService.addSubMenuItem('topbar', 'devops', {
      title: '空调任务',
      state: 'devops.aircon-action',
      roles: ['admin', '运维/客服/工程', '开发/测试'],
      position: 0
    });

    menuService.addSubMenuItem('topbar', 'devops', {
      title: '功能测试工具',
      state: 'devops.functiontest',
      roles: ['admin', '运维/客服/工程', '开发/测试'],
      position: 1
    });

    menuService.addSubMenuItem('topbar', 'devops', {
      title: '协议命令',
      state: 'devops.protcmd',
      roles: ['admin', '开发/测试'],
      position: 99
    });
  }
}());
