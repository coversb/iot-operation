(function () {
  'use strict';

  angular
    .module('devops.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('devops', {
        abstract: true,
        url: '/devops',
        template: '<ui-view/>'
      })
      .state('devops.tools', {
        url: '/tools',
        templateUrl: '/modules/devops/client/views/devops.tools.client.view.html',
        controller: 'DevopsToolsController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', '运维/客服/工程', '开发/测试']
        }
      })
      .state('devops.aircon-action', {
        url: '/aircon-action',
        templateUrl: '/modules/devops/client/views/devops.aircon-action.client.view.html',
        controller: 'DevopsAirconActionController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', '运维/客服/工程', '开发/测试']
        }
      })
      .state('devops.functiontest', {
        url: '/functiontest',
        templateUrl: '/modules/devops/client/views/devops.functiontest.client.view.html',
        controller: 'DevopsFunctionTestController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', '运维/客服/工程', '开发/测试']
        }
      })
      .state('devops.protcmd', {
        url: '/protcmd',
        templateUrl: '/modules/devops/client/views/devops.protcmd.client.view.html',
        controller: 'DevopsProtCmdController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', '开发/测试']
        }
      });
  }
}());
