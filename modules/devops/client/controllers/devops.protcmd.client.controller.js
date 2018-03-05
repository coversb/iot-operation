(function () {
  'use strict';

  angular
    .module('devops.protcmd')
    .controller('DevopsProtCmdController', DevopsProtCmdController);

  DevopsProtCmdController.$inject = ['$scope', '$state', '$http', 'Authentication', 'DevopsSettings', 'DevopsProt'];

  function DevopsProtCmdController($scope, $state, $http, Authentication, DevopsSettings, DevopsProt) {

    var vm = this;

    vm.rtoModal = {
      cmd: '0',
      subCmd: '0',
      uid: '0000000000600000'
    };
    vm.rtoGenData = rtoGenData;
    vm.rtoCmdSend = rtoCmdSend;

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
      uid: '0000000000600000'
    };
    vm.fotaModalURLChange = fotaModalURLChange;
    vm.fotaModalUserNameChange = fotaModalUserNameChange;
    vm.fotaModalUserPasswdChange = fotaModalUserPasswdChange;
    vm.fotaGenData = fotaGenData;
    vm.fotaCmdSend = fotaCmdSend;

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

    // real time operation
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

    function rtoCmdSend() {
      var cmdObj = {};
      cmdObj.uniqueId = vm.rtoModal.uid;
      cmdObj.messageType = 0x01;
      cmdObj.messageSubType = 0x84;
      cmdObj.rtoCommandRequest = {
        'rtoCommand': parseInt(vm.rtoModal.cmd, 10),
        'rtoSubCommand': parseInt(vm.rtoModal.subCmd, 10)
      };
      console.log('rtoCmdSend ' + JSON.stringify(cmdObj));

      sendCommandToBackend(cmdObj, DevopsSettings.rtoConAPI);
    }

    // firmware over the air
    function fotaModalURLChange() {
      vm.fotaModal.urlLen = vm.fotaModal.url.trim().length;
    }

    function fotaModalUserNameChange() {
      vm.fotaModal.userNameLen = vm.fotaModal.userName.trim().length;
    }

    function fotaModalUserPasswdChange() {
      vm.fotaModal.userPasswdLen = vm.fotaModal.userPasswd.trim().length;
    }

    function fotaGenData() {
    }

    function fotaCmdSend() {
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
      console.log('fotaCmdSend ' + JSON.stringify(cmdObj));

      sendCommandToBackend(cmdObj, DevopsSettings.fotaAPI);
    }

  }
}());
