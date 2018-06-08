(function () {
  'use strict';

  angular
    .module('transaction')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: '场馆事务',
      state: 'transaction',
      type: 'dropdown',
      roles: ['admin', '运维/客服/工程', '开发/测试'],
      position: 2
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'transaction', {
      title: '保洁管理',
      state: 'transaction.cleaner-manage',
      roles: ['admin', '运维/客服/工程', '开发/测试'],
      position: 0
    });
  }
}());
