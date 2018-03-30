(function () {
  'use strict';

  angular.module('core')
    .filter('unixTime', unixTime);

  unixTime.$inject = ['$filter'];

  function unixTime($filter) {
    return function (stamp) {

      return $filter('date')(stamp * 1000, 'yyyy-MM-dd HH:mm:ss');
    };
  }
}());
