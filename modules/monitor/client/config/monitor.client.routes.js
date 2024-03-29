(function () {
  'use strict';

  angular
    .module('monitor.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('monitor', {
        url: '/monitor',
        templateUrl: '/modules/monitor/client/views/monitor.client.view.html',
        controller: 'MonitorController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin', '运维/客服/工程', '开发/测试']
        }
      });
  }
}());
