(function () {
  'use strict';

  angular
    .module('devops.protcmd')
    .controller('DevopsProtCmdController', DevopsProtCmdController);

  DevopsProtCmdController.$inject = ['$scope', '$state', '$http', 'Authentication', 'DevopsSettings', 'DevopsProt'];

  function DevopsProtCmdController($scope, $state, $http, Authentication, DevopsSettings, DevopsProt) {

    var vm = this;

    /* apc modal init */
    vm.apcModal = {
      apn: '',
      apnUserName: '',
      apnPassword: '',
      mainDNS: '',
      backupDNS: '',
      uid: '0000000000600000',
      genData: ''
    };
    vm.apcGenData = apcGenData;
    vm.apcSendCmd = apcSendCmd;

    /* ser modal init */
    vm.serModal = {
      mode: '',
      mainServer: '',
      mainPort: '',
      backupServer: '',
      backupPort: '',
      sms: '',
      hbpInterval: '',
      maxRandomTime: '',
      uid: '0000000000600000',
      genData: ''
    };
    vm.serGenData = serGenData;
    vm.serSendCmd = serSendCmd;

    /* cfg modal init */
    vm.cfgModal = {
      mask: '',
      infInterval: '',
      uid: '0000000000600000',
      genData: ''
    };
    vm.cfgGenData = cfgGenData;
    vm.cfgSendCmd = cfgSendCmd;

    /* tma modal init */
    vm.tmaModal = {
      autoAdjust: '1',
      utc: '',
      uid: '0000000000600000',
      genData: ''
    };
    vm.tmaModalFillDatetime = tmaModalFillDatetime;
    vm.tmaGenData = tmaGenData;
    vm.tmaSendCmd = tmaSendCmd;

    /* dog modal init */
    vm.dogModal = {
      sw: '0',
      report: '1',
      interval: '1',
      rebootHour: '',
      rebootMinute: '',
      randomTime: '0',
      uid: '0000000000600000',
      genData: ''
    };
    vm.dogGenData = dogGenData;
    vm.dogSendCmd = dogSendCmd;

    /* aco modal init */
    vm.acoModal = {
      pwrMode: '1',
      workMode: '2',
      wind: '3',
      interval: '',
      duration: '',
      temperature: '',
      uid: '0000000000600000',
      genData: ''
    };
    vm.acoGenData = acoGenData;
    vm.acoSendCmd = acoSendCmd;

    /* sec modal init */
    vm.secModal = {
      uid: '0000000000600000',
      genData: ''
    };
    vm.secGenData = secGenData;
    vm.secSendCmd = secSendCmd;

    /* omc modal init */
    vm.omcModal = {
      idleOutput: '',
      inserviceOutput: '',
      mode: '0',
      beginHour: '',
      beginMinute: '',
      endHour: '',
      endMinute: '',
      validIdleOutput: '',
      validInserviceOutput: '',
      uid: '0000000000600000',
      genData: ''
    };
    vm.omcGenData = omcGenData;
    vm.omcSendCmd = omcSendCmd;

    /* doa modal init */
    vm.doaModal = {
      mode: '1',
      type: '0',
      duration: '15',
      interval: '60',
      uid: '0000000000600000',
      genData: ''
    };
    vm.doaGenData = doaGenData;
    vm.doaSendCmd = doaSendCmd;

    /* sma modal init */
    vm.smaModal = {
      mode: '2',
      threshold: '50',
      duration: '12',
      interval: '60',
      uid: '0000000000600000',
      genData: ''
    };
    vm.smaGenData = smaGenData;
    vm.smaSendCmd = smaSendCmd;

    /* ouo modal init */
    vm.ouoModal = {
      orderNum: '1',
      type: '0',
      orderID: '',
      orderStart: '',
      orderExpire: '',
      orderPassword: '',
      orderPersonNumber: '',
      orderPasswordValidConut: '',
      uid: '0000000000600000',
      genData: ''
    };
    vm.ouoGenData = ouoGenData;
    vm.ouoSendCmd = ouoSendCmd;
    vm.ouoModalFillStartDatetime = ouoModalFillStartDatetime;
    vm.ouoModalFillExpireDatetime = ouoModalFillExpireDatetime;

    /* out modal init */
    vm.outModal = {
      pin: '',
      pinValue: '0',
      pinMask: '',
      uid: '0000000000600000',
      genData: ''
    };
    vm.outGenData = outGenData;
    vm.outSendCmd = outSendCmd;
    vm.outModalPinChange = outModalPinChange;
    vm.outModalPinMaskChange = outModalPinMaskChange;

    /* muo modal init */
    vm.muoModal = {
      type: '1',
      act: '0',
      vol: '',
      mediaFname: '0',
      uid: '0000000000600000',
      genData: ''
    };
    vm.muoGenData = muoGenData;
    vm.muoSendCmd = muoSendCmd;
    vm.muoModalActChange = muoModalActChange;

    /* rto modal init */
    vm.rtoModal = {
      cmd: '0',
      subCmd: '0',
      uid: '0000000000600000',
      genData: ''
    };
    vm.rtoGenData = rtoGenData;
    vm.rtoSendCmd = rtoSendCmd;

    /* fota modal init */
    vm.fotaModal = {
      retry: '1',
      timeout: '3',
      protocol: '0',
      urlLen: '',
      url: '',
      port: '21',
      userNameLen: '',
      userName: '',
      userPasswdLen: '',
      userPasswd: '',
      md5: '',
      key: '0',
      dwnAddr: '0',
      appAddr: '0',
      uid: '0000000000600000',
      genData: ''
    };
    vm.fotaModalURLChange = fotaModalURLChange;
    vm.fotaModalUserNameChange = fotaModalUserNameChange;
    vm.fotaModalUserPasswdChange = fotaModalUserPasswdChange;
    vm.fotaGenData = fotaGenData;
    vm.fotaSendCmd = fotaSendCmd;

    init();

    function init() {
      // If user is not signed in then redirect back home
      if (!Authentication.user) {
        $state.go('home');
      }
    }

    function sendCommandToBackend(data, apiURL) {
      var config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      $http.post(DevopsSettings.backboneURL + apiURL, data, config)
        .success(function (data, status, header, config) {
          console.log('success');
        })
        .error(function (data, status, header, config) {
          console.log('error');
        });
    }

    // fill '0' before string
    function assemblePadZero(str, n) {
      var temp = '0000000000000000' + str;
      return temp.substr(temp.length - n);
    }

    /* access point configuration */
    function apcGenData() {
    }

    function apcSendCmd() {
      var cmdObj = {};
      cmdObj.uniqueId = vm.apcModal.uid;
      cmdObj.messageType = 0x01;
      cmdObj.messageSubType = 0x01;
      cmdObj.guiAccessPointConfigCommandRequest = {
        'accessPointName': vm.apcModal.apn.trim(),
        'aceessPointUserName': vm.apcModal.apnUserName.trim(),
        'accessPointPassword': vm.apcModal.apnPassword.trim(),
        'mainDNSServer': vm.apcModal.mainDNS.trim(),
        'backupDNSServer': vm.apcModal.backupDNS.trim()
      };
      sendCommandToBackend(cmdObj, DevopsSettings.apcConAPI);
    }

    /* server configuration */
    function serGenData() {

    }

    function serSendCmd() {
      var cmdObj = {};
      cmdObj.uniqueId = vm.serModal.uid;
      cmdObj.messageType = 0x01;
      cmdObj.messageSubType = 0x02;
      cmdObj.serverConfigCommandRequest = {
        'reportMode': parseInt(vm.serModal.mode.trim(), 10),
        'mainServerDomainName': vm.serModal.mainServer.trim(),
        'mainServerPort': parseInt(vm.serModal.mainPort.trim(), 10),
        'backupServerDomainName': vm.serModal.backupServer.trim(),
        'backupServerPort': parseInt(vm.serModal.backupPort.trim(), 10),
        'smsGateway': vm.serModal.sms.trim(),
        'heartBeatInterval': parseInt(vm.serModal.hbpInterval.trim(), 10),
        'maxRandomTime': parseInt(vm.serModal.maxRandomTime.trim(), 10)
      };
      sendCommandToBackend(cmdObj, DevopsSettings.serConAPI);
    }

    /* configuration */
    function cfgGenData() {

    }

    function cfgSendCmd() {
      var cmdObj = {};
      cmdObj.uniqueId = vm.cfgModal.uid;
      cmdObj.messageType = 0x01;
      cmdObj.messageSubType = 0x03;
      cmdObj.globalConfigCommandRequest = {
        'eventMask': parseInt(vm.cfgModal.mask.trim(), 16),
        'infoReportInterval': parseInt(vm.cfgModal.infInterval.trim(), 10)
      };
      sendCommandToBackend(cmdObj, DevopsSettings.cfgConAPI);
    }

    /* time adjust */
    function tmaGenData() {

    }

    function tmaSendCmd() {
      var cmdObj = {};
      cmdObj.uniqueId = vm.tmaModal.uid;
      cmdObj.messageType = 0x01;
      cmdObj.messageSubType = 0x04;
      cmdObj.timeAdjustCommandRequest = {
        'timeAdjust': tmaAssembleTimeAdjust(),
        'utcTime': parseInt(vm.tmaModal.utc.trim(), 10)
      };
      sendCommandToBackend(cmdObj, DevopsSettings.tmaConAPI);
    }

    function tmaAssembleTimeAdjust() {
      var tmaMode = assemblePadZero(Number(vm.tmaModal.autoAdjust).toString(2), 3)
        + '0000000000000';
      return parseInt(tmaMode, 2);
    }

    function tmaModalFillDatetime() {
      vm.tmaModal.utc = (Date.parse(new Date()) / 1000).toString(10);
    }

    /* watchdog */
    function dogGenData() {
    }

    function dogSendCmd() {
      var cmdObj = {};
      cmdObj.uniqueId = vm.dogModal.uid;
      cmdObj.messageType = 0x01;
      cmdObj.messageSubType = 0x05;
      cmdObj.guiWatchdogConfigCommandRequest = {
        'mode': dogAssembleMode(),
        'rebootTime': dogAssembleRebootTime(),
        'maximumRandomTime': parseInt(vm.dogModal.randomTime.trim(), 10)
      };
      sendCommandToBackend(cmdObj, DevopsSettings.dogConAPI);
    }

    function dogAssembleMode() {
      var dogMode = assemblePadZero(Number(vm.dogModal.interval).toString(2), 5)
        + assemblePadZero(Number(vm.dogModal.report).toString(2), 1)
        + assemblePadZero(Number(vm.dogModal.sw).toString(2), 2);
      return parseInt(dogMode, 2);
    }

    function dogAssembleRebootTime() {
      var dogRebootTime = '00000'
        + assemblePadZero(Number(vm.dogModal.rebootHour).toString(2), 5)
        + assemblePadZero(Number(vm.dogModal.rebootMinute).toString(2), 6);
      return parseInt(dogRebootTime, 2);
    }

    /* air conditioner operation */
    function acoGenData() {
    }

    function acoSendCmd() {
      var cmdObj = {};
      cmdObj.uniqueId = vm.acoModal.uid;
      cmdObj.messageType = 0x01;
      cmdObj.messageSubType = 0x06;
      cmdObj.airconCommandRequest = {
        'airConMode': acoAssembleMode(),
        'airConInterval': parseInt(vm.acoModal.interval.trim(), 10),
        'airConDuration': parseInt(vm.acoModal.duration.trim(), 10),
        'airConTemperature': parseInt(vm.acoModal.temperature.trim(), 10)
      };
      sendCommandToBackend(cmdObj, DevopsSettings.airConditionerConAPI);
    }

    function acoAssembleMode() {
      var devAirConMode = '00'
        + assemblePadZero(Number(vm.acoModal.wind).toString(2), 2)
        + assemblePadZero(Number(vm.acoModal.workMode).toString(2), 2)
        + assemblePadZero(Number(vm.acoModal.pwrMode).toString(2), 2);
      return parseInt(devAirConMode, 2);
    }

    /* security configuration*/
    function secGenData() {
    }

    function secSendCmd() {
      console.log('SEC NOT IMPLEMENT');
    }

    /* output mode configuration */
    function omcGenData() {

    }

    function omcSendCmd() {
      var cmdObj = {};
      cmdObj.uniqueId = vm.omcModal.uid;
      cmdObj.messageType = 0x01;
      cmdObj.messageSubType = 0x08;
      cmdObj.guiOutputModeConfigCommandRequest = {
        'idleOutput': parseInt(vm.omcModal.idleOutput, 16),
        'inServiceOutput': parseInt(vm.omcModal.inserviceOutput, 16),
        'validTimeIdleOutput': parseInt(vm.omcModal.validIdleOutput, 16),
        'validTimeInServiceOutput': parseInt(vm.omcModal.validInserviceOutput, 16),
        'mode': parseInt(vm.omcModal.mode, 10),
        'validTime': omcAssembleValidTime()
      };
      sendCommandToBackend(cmdObj, DevopsSettings.omcConAPI);
    }

    function omcAssembleValidTime() {
      var validTime = '00000000000'
        + assemblePadZero(Number(vm.omcModal.endMinute).toString(2), 6)
        + assemblePadZero(Number(vm.omcModal.endHour).toString(2), 5)
        + assemblePadZero(Number(vm.omcModal.beginMinute).toString(2), 6)
        + assemblePadZero(Number(vm.omcModal.beginHour).toString(2), 5);
      return parseInt(validTime, 2);
    }

    /* door alarm */
    function doaGenData() {

    }

    function doaSendCmd() {
      var cmdObj = {};
      cmdObj.uniqueId = vm.doaModal.uid;
      cmdObj.messageType = 0x01;
      cmdObj.messageSubType = 0x31;
      cmdObj.guiDoorAlarmCommandRequest = {
        'doorAlarmMode': parseInt(vm.doaModal.mode.trim(), 10),
        'doorAlarmTrigger': parseInt(vm.doaModal.type.trim(), 10),
        'doorAlarmDuration': parseInt(vm.doaModal.duration.trim(), 10),
        'doorAlarmSendInterval': parseInt(vm.doaModal.interval.trim(), 10)
      };
      sendCommandToBackend(cmdObj, DevopsSettings.doaConAPI);
    }

    /* smoke alarm */
    function smaGenData() {

    }

    function smaSendCmd() {
      var cmdObj = {};
      cmdObj.uniqueId = vm.smaModal.uid;
      cmdObj.messageType = 0x01;
      cmdObj.messageSubType = 0x32;
      cmdObj.guiSmokeAlarmCommandRequest = {
        'smokeAlarmMode': parseInt(vm.smaModal.mode.trim(), 10),
        'smokeAlarmThreshold': parseInt(vm.smaModal.threshold.trim(), 10),
        'smokeAlarmDuration': parseInt(vm.smaModal.duration.trim(), 10),
        'smokeAlarmSendInterval': parseInt(vm.smaModal.interval.trim(), 10)
      };
      sendCommandToBackend(cmdObj, DevopsSettings.smaConAPI);
    }

    /* order update operation */
    function ouoGenData() {
    }

    function ouoSendCmd() {
      var cmdObj = {};
      cmdObj.uniqueId = vm.ouoModal.uid;
      cmdObj.messageType = 0x01;
      cmdObj.messageSubType = 0x81;
      cmdObj.guiUpdateOrderCommandRequest = {
        'actionType': parseInt(vm.ouoModal.type.trim(), 10),
        'orderID': parseInt(vm.ouoModal.orderID.trim(), 10),
        'startDateTime': parseInt(vm.ouoModal.orderStart.trim(), 10),
        'expireDateTime': parseInt(vm.ouoModal.orderExpire.trim(), 10),
        'orderPassword': parseInt(vm.ouoModal.orderPassword.trim(), 10),
        'personNumber': parseInt(vm.ouoModal.orderPersonNumber.trim(), 10),
        'passwordValidCount': parseInt(vm.ouoModal.orderPasswordValidConut.trim(), 10)
      };
      sendCommandToBackend(cmdObj, DevopsSettings.ouoConAPI);
    }

    function ouoModalFillStartDatetime() {
      vm.ouoModal.orderStart = (Date.parse(new Date()) / 1000).toString(10);
    }

    function ouoModalFillExpireDatetime() {
      if (vm.ouoModal.orderStart.trim() !== '') {
        vm.ouoModal.orderExpire = (parseInt(vm.ouoModal.orderStart.trim(), 10) + 3600).toString(10);
      }
    }

    /* output operation */
    function outGenData() {
    }

    function outSendCmd() {
      var cmdObj = {};
      cmdObj.uniqueId = vm.outModal.uid;
      cmdObj.messageType = 0x01;
      cmdObj.messageSubType = 0x82;
      cmdObj.outputConfigCommandRequest = {
        'outputNumber': parseInt(vm.outModal.pin.trim(), 10),
        'outputPin': parseInt(vm.outModal.pinValue.trim(), 10),
        'controlMask': parseInt(vm.outModal.pinMask.trim(), 16)
      };
      sendCommandToBackend(cmdObj, DevopsSettings.outConAPI);
    }

    function outModalPinChange() {
      if (vm.outModal.pin !== '0' && vm.outModal.pin !== undefined) {
        $('#outModalPinMask').attr('readOnly', 'readOnly');
        vm.outModal.pinMask = '00000000';
      } else {
        $('#outModalPinMask').removeAttr('readOnly');
      }
    }

    function outModalPinMaskChange() {
      if (vm.outModal.pinMask !== '' && vm.outModal.pinMask !== undefined) {
        $('#outModalPin').attr('readOnly', 'readOnly');
        vm.outModal.pin = '0';
      } else {
        $('#outModalPin').removeAttr('readOnly');
      }
    }

    /* multimedia operation */
    function muoGenData() {
    }

    function muoSendCmd() {
      var cmdObj = {};
      cmdObj.uniqueId = vm.muoModal.uid;
      cmdObj.messageType = 0x01;
      cmdObj.messageSubType = 0x83;
      cmdObj.guiMultimediaCommandConfigRequest = {
        'mode': muoAssembleMode(),
        'volume': parseInt(vm.muoModal.vol.trim(), 10),
        'fileName': parseInt(vm.muoModal.mediaFname.trim(), 10)
      };
      sendCommandToBackend(cmdObj, DevopsSettings.muoConAPI);
    }

    function muoAssembleMode() {
      var mode = assemblePadZero(Number(vm.muoModal.act).toString(2), 4)
        + assemblePadZero(Number(vm.muoModal.type).toString(2), 4);
      return parseInt(mode, 2);
    }

    function muoModalActChange() {
      switch (vm.muoModal.act) {
        case '0':
        case '11':
        case '12': {
          $('#muoModalVolume').attr('readOnly', 'readOnly');
          $('#muoModalMediaFname').attr('readOnly', 'readOnly');
          $('#muoModalMediaFname').attr('disabled', 'disabled');
          vm.muoModal.vol = '0';
          break;
        }
        case '1': {
          $('#muoModalVolume').attr('readOnly', 'readOnly');
          $('#muoModalMediaFname').removeAttr('readOnly');
          $('#muoModalMediaFname').removeAttr('disabled');
          vm.muoModal.vol = '0';
          break;
        }
        case '10': {
          $('#muoModalVolume').removeAttr('readOnly');
          $('#muoModalMediaFname').attr('readOnly', 'readOnly');
          $('#muoModalMediaFname').attr('disabled', 'disabled');
          vm.muoModal.vol = '';
          break;
        }
        default:
          break;
      }
    }

    $('#muoModal').on('shown.bs.modal', function () {
      muoModalActChange();
    });

    /* real time operation */
    function rtoGenData() {
      /*
      var param = {
        'uid': vm.rtoModal.uid,
        'rtoCommand': parseInt(vm.rtoModal.cmd, 10),
        'rtoSubCommand': parseInt(vm.rtoModal.subCmd, 10)
      };
      vm.rtoModal.genData = DevopsProt.getCommand('RTO', param);
      */
    }

    function rtoSendCmd() {
      var cmdObj = {};
      cmdObj.uniqueId = vm.rtoModal.uid;
      cmdObj.messageType = 0x01;
      cmdObj.messageSubType = 0x84;
      cmdObj.rtoCommandRequest = {
        'rtoCommand': parseInt(vm.rtoModal.cmd, 10),
        'rtoSubCommand': parseInt(vm.rtoModal.subCmd, 10)
      };
      sendCommandToBackend(cmdObj, DevopsSettings.rtoConAPI);
    }

    /* firmware over the air */
    function fotaModalURLChange() {
      var urlLen = 0;
      if (vm.fotaModal.url !== undefined) {
        urlLen = vm.fotaModal.url.trim().length;
      }
      vm.fotaModal.urlLen = urlLen;
    }

    function fotaModalUserNameChange() {
      var userNameLen = 0;
      if (vm.fotaModal.userName !== undefined) {
        userNameLen = vm.fotaModal.userName.trim().length;
      }
      vm.fotaModal.userNameLen = userNameLen;
    }

    function fotaModalUserPasswdChange() {
      var userPasswdLen = 0;
      if (vm.fotaModal.userPasswd !== undefined) {
        userPasswdLen = vm.fotaModal.userPasswd.trim().length;
      }
      vm.fotaModal.userPasswdLen = userPasswdLen;
    }

    function fotaGenData() {
    }

    function fotaSendCmd() {
      var cmdObj = {};
      cmdObj.uniqueId = vm.fotaModal.uid;
      cmdObj.messageType = 0x01;
      cmdObj.messageSubType = 0xF1;
      cmdObj.otaCommandRequest = {
        'otaRetryTimes': parseInt(vm.fotaModal.retry.trim(), 10),
        'otaDownloadTimeout': parseInt(vm.fotaModal.timeout.trim(), 10),
        'otaDownloadProtocol': parseInt(vm.fotaModal.protocol.trim(), 10),
        'otaServerUrlLength': vm.fotaModal.url.trim().length,
        'otaServerUrl': vm.fotaModal.url.trim(),
        'otaServerPort': parseInt(vm.fotaModal.port.trim(), 10),
        'otaServerUsernameLength': vm.fotaModal.userName.trim().length,
        'otaServerUserName': vm.fotaModal.userName.trim(),
        'otaServerPasswordLength': vm.fotaModal.userPasswd.trim().length,
        'otaServerPassword': vm.fotaModal.userPasswd.trim(),
        'otaServerMD5': vm.fotaModal.md5.trim(),
        'otaServerKey': parseInt(vm.fotaModal.key.trim(), 10),
        'otaDownloadAddress': parseInt(vm.fotaModal.dwnAddr.trim(), 16),
        'otaAppBootupAddress': parseInt(vm.fotaModal.appAddr.trim(), 16)
      };
      sendCommandToBackend(cmdObj, DevopsSettings.fotaAPI);
    }

  }
}());
