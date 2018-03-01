(function () {
  'use strict';

  // DevopsSetting service for devops

  angular
    .module('devops.services')
    .factory('DevopsSettings', DevopsSettings);

  function DevopsSettings() {
    var settings = {
      backboneURL: 'http://integration-iot.gongyuanhezi.cn',
      // command API
      airConditionerConAPI: '/gui/sendAirconConfigCommand',
      rtoConAPI: '/gui/sendRTOCommand',
      // device info API
      boxListAPI: '/venueStatus'
    };

    return settings;
  }
}());
