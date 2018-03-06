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
      apcConAPI: '/gui/sendAccessPointCommand',
      serConAPI: '/gui/sendServerConfigCommand',
      airConditionerConAPI: '/gui/sendAirconConfigCommand',
      rtoConAPI: '/gui/sendRTOCommand',
      fotaAPI: '/gui/sendOTACommand',
      // device info API
      boxListAPI: '/venueStatus'
    };

    return settings;
  }
}());
