(function (window) {
  'use strict';

  var applicationModuleName = 'mean';

  var service = {
    applicationEnvironment: window.env,
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: ['ngResource', 'ngAnimate', 'ngMessages', 'ui.router', 'ui.bootstrap', 'ngFileUpload', 'ui-notification', 'FileManagerApp'],
    registerModule: registerModule
  };

  window.ApplicationConfiguration = service;

  // Add a new vertical module
  function registerModule(moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  }

  // Angular-ui-notification configuration
  angular.module('ui-notification').config(function (NotificationProvider) {
    NotificationProvider.setOptions({
      delay: 2000,
      startTop: 20,
      startRight: 10,
      verticalSpacing: 20,
      horizontalSpacing: 20,
      positionX: 'right',
      positionY: 'bottom'
    });
  });

  // angular.module('FileManagerApp').config(['fileManagerConfigProvider', function (config) {
  //   var defaults = config.$get();
  //   config.set({
  //     appName: 'angular-filemanager',
  //     pickCallback: function(item) {
  //       var msg = 'Picked %s "%s" for external use'
  //         .replace('%s', item.type)
  //         .replace('%s', item.fullPath());
  //       window.alert(msg);
  //     },
  //
  //     allowedActions: angular.extend(defaults.allowedActions, {
  //       pickFiles: true,
  //       pickFolders: false,
  //     }),
  //   });
  // }]);

  angular.module('FileManagerApp').config(function (fileManagerConfigProvider) {

    fileManagerConfigProvider.set({
      appName: 'Version Manager',
      copyUrl: '/files/copy', // where {/files} is the mount path of this module.
      createFolderUrl: '/files/createFolder',
      downloadFileUrl: '/files/download',
      editUrl: '/files/edit',
      removeUrl: '/files/remove',
      renameUrl: '/files/rename',
      uploadUrl: '/files/upload',
      getContentUrl: '/files/getContent',
      listUrl: '/files/list'
    });
  });
}(window));
