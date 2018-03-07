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
      cfgConAPI: '/gui/sendGlobalServerConfigCommand',
      tmaConAPI: '/gui/sendTimeAdjustConfigCommand',
      dogConAPI: '/gui/sendWatchdogConfigCommand',
      airConditionerConAPI: '/gui/sendAirconConfigCommand',
      omcConAPI: '/gui/sendOutputModeConfigCommand',
      doaConAPI: '/gui/sendDoorAlarmCommand',
      smaConAPI: '/gui/sendSmokeAlarmCommand',
      ouoConAPI: '/gui/sendOrderUpdateCommand',
      outConAPI: '/gui/sendOutputOperationCommand',
      rtoConAPI: '/gui/sendRTOCommand',
      fotaAPI: '/gui/sendOTACommand',
      // device info API
      boxListAPI: '/venueStatus'
    };

    return settings;
  }
}());
