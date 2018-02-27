(function () {
  'use strict';

  angular
    .module('devops.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('devops', {
        url: '/devops',
        templateUrl: '/modules/devops/client/views/devops.client.view.html',
        controller: 'DevopsController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
}());
