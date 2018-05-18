(function () {
  'use strict';

  // DevopsSetting service for devops

  angular
    .module('devops.services')
    .factory('DevopsSettings', DevopsSettings);

  DevopsSettings.$inject = ['ENV_VARS'];

  function DevopsSettings(ENV_VARS) {
    var settings = {
      // backbone base url
      backboneURL: ENV_VARS.backboneUrl,
      // command API
      apcConAPI: '/gui/sendAccessPointCommand',
      tmpConAPI: '/dstTemperature',
      serConAPI: '/gui/sendServerConfigCommand',
      cfgConAPI: '/gui/sendGlobalServerConfigCommand',
      tmaConAPI: '/gui/sendTimeAdjustConfigCommand',
      dogConAPI: '/gui/sendWatchdogConfigCommand',
      acoConAPI: '/gui/sendAirconConfigCommand',
      omcConAPI: '/gui/sendOutputModeConfigCommand',
      acwConAPI: '/gui/sendAirConditionerWorkingConfigCommand',
      doaConAPI: '/gui/sendDoorAlarmCommand',
      smaConAPI: '/gui/sendSmokeAlarmCommand',
      ouoConAPI: '/gui/sendOrderUpdateCommand',
      outConAPI: '/gui/sendOutputOperationCommand',
      muoConAPI: '/gui/sendMultimediaConfigCommand',
      rtoConAPI: '/gui/sendRTOCommand',
      fotaAPI: '/gui/sendOTACommand',
      // device info API
      boxListAPI: '/venueStatus'
    };

    return settings;
  }
}());
