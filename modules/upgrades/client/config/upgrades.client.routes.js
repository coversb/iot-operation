(function () {
  'use strict';

  angular
    .module('upgrades.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('upgrades', {
        abstract: true,
        url: '/upgrades',
        template: '<ui-view></ui-view>'
      })
      .state('upgrades.versions', {
        url: '/versions',
        templateUrl: '/modules/upgrades/client/views/upgrades.versions.client.view.html',
        controller: 'UpgradesVersionsController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', '开发/测试']
        },
        resolve: {
          upgradesVersionsResolve: getUpgradesVersions
        }
      })
      .state('upgrades.version', {
        url: '/version',
        templateUrl: '/modules/upgrades/client/views/version-upgrades.client.view.html',
        css: '/lib/angular-filemanager/dist/angular-filemanager.min.css',
        controller: 'UpgradesVersionController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', '开发/测试'],
          pageTitle: 'Version Manager'
        }
      })
      .state('upgrades.batch', {
        url: '/batch',
        templateUrl: '/modules/upgrades/client/views/batch-upgrades.client.view.html',
        controller: 'UpgradesBatchController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', '开发/测试'],
          pageTitle: 'Version Batch'
        },
        resolve: {
          upgradesBatchResolve: getUpgradesVersions
        }
      });
  }

  getUpgradesVersions.$inject = ['$stateParams', 'UpgradesVersionsService'];

  function getUpgradesVersions($stateParams, UpgradesVersionsService) {
    return UpgradesVersionsService.get({
      versionsId: $stateParams.versionsId
    }).$promise;
  }

  newUpgradesVersions.$inject = ['UpgradesVersionsService'];

  function newUpgradesVersions(UpgradesVersionsService) {
    return new UpgradesVersionsService();
  }
}());
