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
          roles: ['user', 'admin']
        }
      })
      .state('devops.protcmd', {
        url: '/protcmd',
        templateUrl: '/modules/devops/client/views/devops.protcmd.client.view.html',
        controller: 'DevopsProtCmdController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      });
  }
}());
