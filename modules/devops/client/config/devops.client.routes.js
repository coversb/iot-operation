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
      .state('devops.functiontest', {
        url: '/functiontest',
        templateUrl: '/modules/devops/client/views/devops.functiontest.client.view.html',
        controller: 'DevopsFunctionTestController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', '运维/客服/工程', '开发/测试']
        }
      })
      .state('devops.tasks', {
        url: '/tasks',
        templateUrl: '/modules/devops/client/views/devops.tasks.client.view.html',
        controller: 'DevopsTasksController',
        controllerAs: 'vm',
        // onEnter: function($window) {
        //
        //   // use this to redirect to url not apply ui-router state with same domain, please read line below
        //
        //   // - [javascript - Removing current page from browser history - Stack Overflow]
        //   // (https://stackoverflow.com/questions/42918837/removing-current-page-from-browser-history)
        //
        //   //- [angularjs - How would I have ui-router go to an external link, such as google.com? - Stack Overflow]
        //   // (https://stackoverflow.com/questions/30220947/how-would-i-have-ui-router-go-to-an-external-link-such-as-google-com)
        //
        //   // redirect from  `/devops/agendash` to `/agendash`
        //   $window.location.replace('/agendash');
        // },
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
