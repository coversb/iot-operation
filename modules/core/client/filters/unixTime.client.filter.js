(function () {
  'use strict';

  angular.module('core')
    .filter('unixTime', unixTime);

  unixTime.$inject = ['$filter'];

  function unixTime($filter) {
    return function (stamp) {
      if (stamp == 0) {
        return '--- ';
      }
      return $filter('date')(stamp * 1000, 'yyyy-MM-dd HH:mm:ss');
    };
  }
}());
