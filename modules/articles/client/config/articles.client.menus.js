(function () {
  'use strict';

  angular
    .module('articles')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: '文档',
      state: 'articles',
      type: 'dropdown',
      roles: ['user', 'admin'],
      position: 99
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'articles', {
      title: '帮助',
      state: 'articles.list',
      roles: ['*']
    });
  }
}());
