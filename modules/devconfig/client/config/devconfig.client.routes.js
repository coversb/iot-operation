(function () {
  'use strict';

  angular
    .module('devconfig.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('devconfig', {
        abstract: true,
        url: '/devconfig',
        template: '<ui-view></ui-view>'
      })
      .state('devconfig.configuration', {
        url: '/configuration',
        templateUrl: '/modules/devconfig/client/views/devconfig.configuration.client.view.html',
        controller: 'DevconfigConfigurationController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', '开发/测试']
        }
      })
      .state('devconfig.management', {
        url: '/management',
        templateUrl: '/modules/devconfig/client/views/devconfig.management.client.view.html',
        controller: 'DevconfigManagementController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', '开发/测试']
        }
      });
  }

}());
