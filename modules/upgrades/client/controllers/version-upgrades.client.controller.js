(function () {
  'use strict';

  angular
    .module('upgrades.version')
    .controller('UpgradesVersionController', UpgradesVersionController);

  UpgradesVersionController.$inject = ['$scope', '$css'];

  function UpgradesVersionController($scope, $css) {
    var vm = this;

    $scope.$on('$destroy', function (event) {
      $css.remove('/lib/angular-filemanager/dist/angular-filemanager.min.css');
      console.log('removed');
    });
  }
}());
