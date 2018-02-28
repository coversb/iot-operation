(function () {
  'use strict';

  // DevopsSetting service for devops

  angular
    .module('devops.services')
    .factory('DevopsSettings', DevopsSettings);

  function DevopsSettings() {
    var settings = {
      backboneURL: 'http://integration-iot.gongyuanhezi.cn',
      airConditionerConAPI: '/gui/sendAirconConfigCommand',
      rtoConAPI: '/gui/sendRTOCommand'
    };

    return settings;
  }
}());
