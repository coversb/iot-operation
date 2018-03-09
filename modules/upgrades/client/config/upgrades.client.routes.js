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
        template: '<ui-view/>'
      })
      .state('upgrades.versions', {
        url: '/versions',
        templateUrl: '/modules/upgrades/client/views/upgrades.versions.client.view.html',
        controller: 'UpgradesVersionsController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin']
        },
        resolve: {
          upgradesVersionsResolve: getUpgradesVersions
        }
      })
      .state('upgrades.version', {
        url: '',
        templateUrl: 'modules/upgrades/client/views/version-upgrades.client.view.html',
        controller: 'UpgradesVersionController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Version Manager'
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

  angular.module('FileManagerApp').config(['fileManagerConfigProvider', function (config) {
    var defaults = config.$get();
    config.set({
      appName: 'angular-filemanager',
      pickCallback: function (item) {
        var msg = 'Picked %s "%s" for external use'
          .replace('%s', item.type)
          .replace('%s', item.fullPath());
        window.alert(msg);
      },
      allowedActions: angular.extend(defaults.allowedActions, {
        pickFiles: true,
        pickFolders: false
      })
    });
  }]);

}());
