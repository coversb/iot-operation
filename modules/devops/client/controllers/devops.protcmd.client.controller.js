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

    /* configuration modal init */
    vm.cfgModal = {
      mask: '',
      infInterval: '',
      uid: '0000000000600000',
      genData: ''
    };
    vm.cfgGenData = cfgGenData;
    vm.cfgSendCmd = cfgSendCmd;

    /* time adjust modal init */
    vm.tmaModal = {
      autoAdjust: '1',
      utc: '',
      uid: '0000000000600000',
      genData: ''
    };
    vm.tmaModalFillDatetime = tmaModalFillDatetime;
    vm.tmaGenData = tmaGenData;
    vm.tmaSendCmd = tmaSendCmd;

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
