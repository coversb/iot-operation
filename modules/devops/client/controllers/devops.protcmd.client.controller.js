(function () {
  'use strict';

  angular
    .module('devops.protcmd')
    .controller('DevopsProtCmdController', DevopsProtCmdController);

  DevopsProtCmdController.$inject = ['$scope', '$state', 'Authentication', 'DevopsProt', 'Notification'];

  function DevopsProtCmdController($scope, $state, Authentication, DevopsProt, Notification) {

    var vm = this;

    /* apc modal init */
    vm.apcModal = {
      apn: '',
      apnUserName: '',
      apnPassword: '',
      mainDNS: [114, 114, 114, 114],
      backupDNS: [114, 114, 114, 114],
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
      type: 'F3',
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

    /* acw modal init */
    vm.acwModal = {
      mode: '0',
      pwronEventMask: '',
      pwroffEventMask: '',
      duration: '',
      beginHour: '',
      beginMinute: '',
      endHour: '',
      endMinute: '',
      uid: '0000000000600000',
      genData: ''
    };
    vm.acwGenData = acwGenData;
    vm.acwSendCmd = acwSendCmd;

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

    function showSendRes(data, status) {
      if (status === 200) {
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> 发送成功!' });
      } else {
        Notification.error({ message: data, title: '<i class="glyphicon glyphicon-remove"></i> 发送失败!' });
      }
    }

    /* access point configuration */
    function apcGenData() {
      vm.apcModal.genData = DevopsProt.getCommand('APC', vm.apcModal);
    }

    function apcSendCmd() {
      DevopsProt.sendCommand('APC', vm.apcModal, showSendRes);
    }

    /* server configuration */
    function serGenData() {
      vm.serModal.genData = DevopsProt.getCommand('SER', vm.serModal);
    }

    function serSendCmd() {
      DevopsProt.sendCommand('SER', vm.serModal, showSendRes);
    }

    /* configuration */
    function cfgGenData() {
      vm.cfgModal.genData = DevopsProt.getCommand('CFG', vm.cfgModal);
    }

    function cfgSendCmd() {
      DevopsProt.sendCommand('CFG', vm.cfgModal, showSendRes);
    }

    /* time adjust */
    function tmaGenData() {
      vm.tmaModal.genData = DevopsProt.getCommand('TMA', vm.tmaModal);
    }

    function tmaSendCmd() {
      DevopsProt.sendCommand('TMA', vm.tmaModal, showSendRes);
    }

    function tmaModalFillDatetime() {
      vm.tmaModal.utc = (Date.parse(new Date()) / 1000).toString(10);
    }

    /* watchdog */
    function dogGenData() {
      vm.dogModal.genData = DevopsProt.getCommand('DOG', vm.dogModal);
    }

    function dogSendCmd() {
      DevopsProt.sendCommand('DOG', vm.dogModal, showSendRes);
    }

    /* air conditioner operation */
    function acoGenData() {
      vm.acoModal.genData = DevopsProt.getCommand('ACO', vm.acoModal);
    }

    function acoSendCmd() {
      DevopsProt.sendCommand('ACO', vm.acoModal, showSendRes);
    }

    /* security configuration*/
    function secGenData() {
      vm.secModal.genData = DevopsProt.getCommand('SEC', vm.secModal);
    }

    function secSendCmd() {
      DevopsProt.sendCommand('SEC', vm.secModal, showSendRes);
    }

    /* output mode configuration */
    function omcGenData() {
      vm.omcModal.genData = DevopsProt.getCommand('OMC', vm.omcModal);
    }

    function omcSendCmd() {
      DevopsProt.sendCommand('OMC', vm.omcModal, showSendRes);
    }

    /* air conditioner working configuration */
    function acwGenData() {
      vm.acwModal.genData = DevopsProt.getCommand('ACW', vm.acwModal);
    }

    function acwSendCmd() {
      DevopsProt.sendCommand('ACW', vm.acwModal, showSendRes);
    }

    /* door alarm */
    function doaGenData() {
      vm.doaModal.genData = DevopsProt.getCommand('DOA', vm.doaModal);
    }

    function doaSendCmd() {
      DevopsProt.sendCommand('DOA', vm.doaModal, showSendRes);
    }

    /* smoke alarm */
    function smaGenData() {
      vm.smaModal.genData = DevopsProt.getCommand('SMA', vm.smaModal);
    }

    function smaSendCmd() {
      DevopsProt.sendCommand('SMA', vm.smaModal, showSendRes);
    }

    /* order update operation */
    function ouoGenData() {
      vm.ouoModal.genData = DevopsProt.getCommand('OUO', vm.ouoModal);
    }

    function ouoSendCmd() {
      DevopsProt.sendCommand('OUO', vm.ouoModal, showSendRes);
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
      vm.outModal.genData = DevopsProt.getCommand('OUT', vm.outModal);
    }

    function outSendCmd() {
      DevopsProt.sendCommand('OUT', vm.outModal, showSendRes);
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
      vm.muoModal.genData = DevopsProt.getCommand('MUO', vm.muoModal);
    }

    function muoSendCmd() {
      DevopsProt.sendCommand('MUO', vm.muoModal, showSendRes);
    }

    function muoModalActChange() {
      switch (vm.muoModal.act) {
        case '0':
        case '2':
        case '3':
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
      vm.rtoModal.genData = DevopsProt.getCommand('RTO', vm.rtoModal);
    }

    function rtoSendCmd() {
      DevopsProt.sendCommand('RTO', vm.rtoModal, showSendRes);
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
      vm.fotaModal.genData = DevopsProt.getCommand('FOTA', vm.fotaModal);
    }

    function fotaSendCmd() {
      DevopsProt.sendCommand('FOTA', vm.fotaModal, showSendRes);
    }

  }
}());
