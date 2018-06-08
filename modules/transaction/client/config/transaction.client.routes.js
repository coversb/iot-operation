(function () {
  'use strict';

  angular
    .module('transaction.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('transaction', {
        abstract: true,
        url: '/transaction',
        template: '<ui-view></ui-view>'
      })
      .state('transaction.cleaner-manage', {
        url: '/cleaner-manage',
        templateUrl: '/modules/transaction/client/views/transaction.cleaner-manage.client.view.html',
        controller: 'TransactionCleanerManageController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', '运维/客服/工程', '开发/测试']
        }
      });
  }

}());
