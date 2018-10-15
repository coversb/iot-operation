(function () {
  'use strict';

  // api settings
  angular
    .module('operation-center.setting')
    .factory('OperationCenterSetting', OperationCenterSetting);

  OperationCenterSetting.$inject = ['ENV_VARS'];

  function OperationCenterSetting(ENV_VARS) {
    var setting = {
      // backbone base url
      backboneURL: ENV_VARS.backboneUrl,
      apiURL: ENV_VARS.backboneUrl.replace(/iot/, 'api'),
      // common api
      availableCityAPI: '/backend/venue_cleaner/list_open_citys ',
      availableBoxAPI: '/backend/venue_cleaner/list_venue',
      // air-conditioner actions
      airconActionListAPI: '/backend/venue_air_conditioner_work_time/list_venue_air_conditioner_work_time',
      airconActionUpdateAPI: '/backend/venue_air_conditioner_work_time/add_or_update_venue_air_conditioner_work_time',
      airconActionDeleteAPI: '/backend/venue_air_conditioner_work_time/remove_venue_air_conditioner_work_time',
      // tv app API
      tvVolListAPI: '/transformer/venueaction/get_volume_list',
      tvVolUpdateAPI: '/transformer/venueaction/set_volume_list',
      // temperature control API
      tmpConAPI: '/dstTemperature',
      // command API
      apcConAPI: '/gui/sendAccessPointCommand',
      serConAPI: '/gui/sendServerConfigCommand',
      cfgConAPI: '/gui/sendGlobalServerConfigCommand',
      tmaConAPI: '/gui/sendTimeAdjustConfigCommand',
      dogConAPI: '/gui/sendWatchdogConfigCommand',
      acoConAPI: '/gui/sendAirconConfigCommand',
      omcConAPI: '/gui/sendOutputModeConfigCommand',
      acwConAPI: '/gui/sendAirConditionerWorkingConfigCommand',
      owcConAPI: '/gui/sendOutputWorkingConfigCommand',
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

    return setting;
  }
}());
