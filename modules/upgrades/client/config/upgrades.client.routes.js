(function () {
  'use strict';

  angular
    .module('upgrades')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('upgrades', {
        abstract: true,
        url: '/upgrades',
        template: '<ui-view/>'
      })
      .state('upgrades.list', {
        url: '',
        templateUrl: 'modules/upgrades/client/views/list-upgrades.client.view.html',
        controller: 'UpgradesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Upgrades List'
        }
      })
      .state('upgrades.version', {
        url: '/version',
        templateUrl: 'modules/upgrades/client/views/version-upgrades.client.view.html',
        css: '/lib/angular-filemanager/dist/angular-filemanager.min.css',
        controller: 'UpgradesVersionController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Version Manager'
        }
      })
      .state('upgrades.create', {
        url: '/create',
        templateUrl: 'modules/upgrades/client/views/form-upgrade.client.view.html',
        controller: 'UpgradesController',
        controllerAs: 'vm',
        resolve: {
          upgradeResolve: newUpgrade
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Upgrades Create'
        }
      })
      .state('upgrades.edit', {
        url: '/:upgradeId/edit',
        templateUrl: 'modules/upgrades/client/views/form-upgrade.client.view.html',
        controller: 'UpgradesController',
        controllerAs: 'vm',
        resolve: {
          upgradeResolve: getUpgrade
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Upgrade {{ upgradeResolve.name }}'
        }
      })
      .state('upgrades.view', {
        url: '/:upgradeId',
        templateUrl: 'modules/upgrades/client/views/view-upgrade.client.view.html',
        controller: 'UpgradesController',
        controllerAs: 'vm',
        resolve: {
          upgradeResolve: getUpgrade
        },
        data: {
          pageTitle: 'Upgrade {{ upgradeResolve.name }}'
        }
      });
  }

  angular.module('FileManagerApp').config(['fileManagerConfigProvider', function (config) {
    var defaults = config.$get();
    config.set({
      appName: 'angular-filemanager',
      pickCallback: function(item) {
        var msg = 'Picked %s "%s" for external use'
          .replace('%s', item.type)
          .replace('%s', item.fullPath());
        window.alert(msg);
      },

      allowedActions: angular.extend(defaults.allowedActions, {
        pickFiles: true,
        pickFolders: false,
      }),
    });
  }]);

  getUpgrade.$inject = ['$stateParams', 'UpgradesService'];

  function getUpgrade($stateParams, UpgradesService) {
    return UpgradesService.get({
      upgradeId: $stateParams.upgradeId
    }).$promise;
  }

  newUpgrade.$inject = ['UpgradesService'];

  function newUpgrade(UpgradesService) {
    return new UpgradesService();
  }
}());
