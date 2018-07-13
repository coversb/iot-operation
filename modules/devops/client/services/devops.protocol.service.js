(function () {
  'use strict';

  // DevopsProt service for devops

  angular
    .module('devops.prot.services')
    .factory('DevopsProt', DevopsProt);

  var PROTVER = '0118'; // protocol version V1.24
  var PROTDEVTYPE = '01'; // device type
  var PROTSTART = '2B5042'; // protocol starter '+PB'
  var PROTTAIL = '0D0A';

  var SECKEY_HEADER = 'DEADBEEF';
  var SECKEY_TAIL = 'BEEFDEAD';

  DevopsProt.$inject = ['$http', 'DevopsSettings', 'OperationLogService'];

  function DevopsProt($http, DevopsSettings, OperationLogService) {
    var prot = {
      settings: DevopsSettings,
      getCommand: getCommand,
      sendCommand: sendCommand,
      httpSendRequest: function (api, data, resCallback) {
        var config = {
          headers: {
            'Content-Type': 'application/json'
          }
        };

        $http.post(DevopsSettings.backboneURL + api, data, config)
          .success(function (data, status) {
            if (resCallback !== undefined) {
              resCallback(data, status);
            }
          })
          .error(function (data, status) {
            // console.log('error');
            if (resCallback !== undefined) {
              resCallback(data, status);
            }
          });

      },
      operationLogger: OperationLogService
    };

    return prot;
  }

  /* TV_VOL command begin */
  var TV_VOL = {
    send: function (httpSendRequest, api, param, cb) {
      var tvVolumeUpdate = [];
      for (var idx = 0; idx < param.uid.length; idx++) {
        var tvVolumeItem = {
          fvenueId: param.uid[idx],
          fvolume: parseInt(param.volume.trim(), 10)
        };
        tvVolumeUpdate[idx] = tvVolumeItem;
      }
      httpSendRequest(api, tvVolumeUpdate, cb);
    }
  };
  /* TMP command end */

  /* TMP command begin */
  var TMP = {
    send: function (httpSendRequest, api, param, cb) {
      var cmdObj = {};
      cmdObj.uniqueId = param.uid;
      cmdObj.temperature = parseInt(param.temperature.trim(), 10);
      cmdObj.dstSwitch = param.switch;
      httpSendRequest(api, cmdObj, cb);
    }
  };
  /* TMP command end */

  /* APC command begin */
  var APC = {
    assemble: function (param) {
      var res = '';

      res = assembleMessageType(res, '0101');
      res += this.assembleFiledLength(param.apn.trim().length, param.apnUserName.trim().length, param.apnPassword.trim().length);
      res += convertStrToHexStr(param.apn.trim());
      res += convertStrToHexStr(param.apnUserName.trim());
      res += convertStrToHexStr(param.apnPassword.trim());
      res += this.assembleIP(param.mainDNS);
      res += this.assembleIP(param.backupDNS);

      return res;
    },
    send: function (httpSendRequest, api, param, cb) {
      var cmdObj = {};
      cmdObj.uniqueId = param.uid;
      cmdObj.messageType = 0x01;
      cmdObj.messageSubType = 0x01;
      cmdObj.guiAccessPointConfigCommandRequest = {
        'accessPointName': param.apn,
        'aceessPointUserName': param.apnUserName,
        'accessPointPassword': param.apnPassword,
        'mainDNSServer': this.assembleIP(param.mainDNS),
        'backupDNSServer': this.assembleIP(param.backupDNS)
      };

      httpSendRequest(api, cmdObj, cb);
    },
    assembleFiledLength: function (apnLen, apnUsrNameLen, apnPasswordLen) {
      var filedLen = assemblePadZero(apnPasswordLen.toString(2), 5)
        + assemblePadZero(apnUsrNameLen.toString(2), 5)
        + assemblePadZero(apnLen.toString(2), 6);

      return assemblePadZero(parseInt(filedLen, 2).toString(16), 4);
    },
    assembleIP: function (ip) {
      var ipAddr = convertDecStrToHexStr(ip[0], 2)
        + convertDecStrToHexStr(ip[1], 2)
        + convertDecStrToHexStr(ip[2], 2)
        + convertDecStrToHexStr(ip[3], 2);
      return ipAddr;
    }
  };
  /* APC command end */

  /* SER command begin */
  var SER = {
    assemble: function (param) {
      var res = '';

      res = assembleMessageType(res, '0102');
      res += this.assembleFiledLength(param.mainServer.trim().length, param.backupServer.trim().length, param.sms.trim().length);
      res += convertDecStrToHexStr(param.mode, 2);
      res += convertStrToHexStr(param.mainServer.trim());
      res += convertDecStrToHexStr(param.mainPort, 4);
      res += convertStrToHexStr(param.backupServer.trim());
      res += convertDecStrToHexStr(param.backupPort, 4);
      res += convertStrToHexStr(param.sms.trim());
      res += convertDecStrToHexStr(param.hbpInterval, 2);
      res += convertDecStrToHexStr(param.maxRandomTime, 4);

      return res;
    },
    send: function (httpSendRequest, api, param, cb) {
      var cmdObj = {};
      cmdObj.uniqueId = param.uid;
      cmdObj.messageType = 0x01;
      cmdObj.messageSubType = 0x02;
      cmdObj.serverConfigCommandRequest = {
        'reportMode': parseInt(param.mode.trim(), 10),
        'mainServerDomainName': param.mainServer.trim(),
        'mainServerPort': parseInt(param.mainPort.trim(), 10),
        'backupServerDomainName': param.backupServer.trim(),
        'backupServerPort': parseInt(param.backupPort.trim(), 10),
        'smsGateway': param.sms.trim(),
        'heartBeatInterval': parseInt(param.hbpInterval.trim(), 10),
        'maxRandomTime': parseInt(param.maxRandomTime.trim(), 10)
      };
      httpSendRequest(api, cmdObj, cb);
    },
    assembleFiledLength: function (mainServerLen, backupServerLen, smsLen) {
      var filedLen = '0000000'
        + assemblePadZero(smsLen.toString(2), 5)
        + assemblePadZero(backupServerLen.toString(2), 6)
        + assemblePadZero(mainServerLen.toString(2), 6);

      return assemblePadZero(parseInt(filedLen, 2).toString(16), 6);
    }
  };
  /* SER command end */

  /* CFG command begin */
  var CFG = {
    assemble: function (param) {
      var res = '';

      res = assembleMessageType(res, '0103');
      res += convertDecStrToHexStr(parseInt(param.mask.trim(), 16).toString(10), 4);
      res += convertDecStrToHexStr(param.infInterval.trim(), 4);

      return res;
    },
    send: function (httpSendRequest, api, param, cb) {
      var cmdObj = {};
      cmdObj.uniqueId = param.uid;
      cmdObj.messageType = 0x01;
      cmdObj.messageSubType = 0x03;
      cmdObj.globalConfigCommandRequest = {
        'eventMask': parseInt(param.mask.trim(), 16),
        'infoReportInterval': parseInt(param.infInterval.trim(), 10)
      };
      httpSendRequest(api, cmdObj, cb);
    }
  };
  /* CFG command end */

  /* TMA command begin */
  var TMA = {
    assemble: function (param) {
      var res = '';

      res = assembleMessageType(res, '0104');
      res += this.assembleTimeAdjust(param.autoAdjust);
      res += convertDecStrToHexStr(param.utc, 8);

      return res;
    },
    send: function (httpSendRequest, api, param, cb) {
      var cmdObj = {};
      cmdObj.uniqueId = param.uid;
      cmdObj.messageType = 0x01;
      cmdObj.messageSubType = 0x04;
      cmdObj.timeAdjustCommandRequest = {
        'timeAdjust': parseInt(this.assembleTimeAdjust(param.autoAdjust), 16),
        'utcTime': parseInt(param.utc.trim(), 10)
      };
      httpSendRequest(api, cmdObj, cb);
    },
    assembleTimeAdjust: function (autoAdjust) {
      var tmaMode = assemblePadZero(Number(autoAdjust).toString(2), 3)
        + '0000000000000';

      return assemblePadZero(parseInt(tmaMode, 2).toString(16), 4);
    }
  };
  /* TMA command end */

  /* DOG command begin */
  var DOG = {
    assemble: function (param) {
      var res = '';

      res = assembleMessageType(res, '0105');
      res += this.assembleMode(param.sw, param.report, param.interval);
      res += this.assembleRebootTime(param.rebootHour, param.rebootMinute);
      res += convertDecStrToHexStr(param.randomTime, 4);

      return res;
    },
    send: function (httpSendRequest, api, param, cb) {
      var cmdObj = {};
      cmdObj.uniqueId = param.uid;
      cmdObj.messageType = 0x01;
      cmdObj.messageSubType = 0x05;
      cmdObj.guiWatchdogConfigCommandRequest = {
        'mode': parseInt(this.assembleMode(param.sw, param.report, param.interval), 16),
        'rebootTime': parseInt(this.assembleRebootTime(param.rebootHour, param.rebootMinute), 16),
        'maximumRandomTime': parseInt(param.randomTime.trim(), 10)
      };
      httpSendRequest(api, cmdObj, cb);
    },
    assembleMode: function (sw, report, interval) {
      var dogMode = assemblePadZero(Number(interval).toString(2), 5)
        + assemblePadZero(Number(report).toString(2), 1)
        + assemblePadZero(Number(sw).toString(2), 2);

      return assemblePadZero(parseInt(dogMode, 2).toString(16), 2);
    },
    assembleRebootTime: function (hour, minute) {
      var dogRebootTime = '00000'
        + assemblePadZero(Number(hour).toString(2), 5)
        + assemblePadZero(Number(minute).toString(2), 6);

      return assemblePadZero(parseInt(dogRebootTime, 2).toString(16), 4);
    }
  };
  /* DOG command end */

  /* ACO command begin */
  var ACO = {
    assemble: function (param) {
      var res = '';

      res = assembleMessageType(res, '0106');
      res += this.assembleMode(param.pwrMode, param.workMode, param.wind);
      res += convertDecStrToHexStr(param.interval, 2);
      res += convertDecStrToHexStr(param.duration, 2);
      res += convertDecStrToHexStr(param.temperature, 2);

      return res;
    },
    send: function (httpSendRequest, api, param, cb) {
      var cmdObj = {};
      cmdObj.uniqueId = param.uid;
      cmdObj.messageType = 0x01;
      cmdObj.messageSubType = 0x06;
      cmdObj.airconCommandRequest = {
        'airConMode': parseInt(this.assembleMode(param.pwrMode, param.workMode, param.wind), 16),
        'airConInterval': parseInt(param.interval.trim(), 10),
        'airConDuration': parseInt(param.duration.trim(), 10),
        'airConTemperature': parseInt(param.temperature.trim(), 10)
      };
      httpSendRequest(api, cmdObj, cb);
    },
    assembleMode: function (pwrMode, workMode, wind) {
      var devAirConMode = '00'
        + assemblePadZero(Number(wind).toString(2), 2)
        + assemblePadZero(Number(workMode).toString(2), 2)
        + assemblePadZero(Number(pwrMode).toString(2), 2);

      return assemblePadZero(parseInt(devAirConMode, 2).toString(16), 2);
    }
  };
  /* ACO command end */

  /* SEC command begin */
  var SEC = {
    assemble: function (param) {
      var isEncrypt = (param.type.indexOf('F') <= -1);
      var res = '';

      res = assembleMessageType(res, '0107');
      res += convertDecStrToHexStr(parseInt(param.type.trim(), 16).toString(10), 2);
      res += this.assembleKey(param.key, isEncrypt);

      return res;
    },
    send: function (httpSendRequest, api, param, cb) {
      alert('SEC NOT IMPLEMENT');
    },
    assembleKey: function (key, isEncrypt) {
      if (key === undefined) {
        key = '';
      }
      var keyData = '';

      keyData += SECKEY_HEADER;
      keyData += assembleAppendZero(convertStrToHexStr(key.trim()), 32 * 2);
      keyData += SECKEY_TAIL;
      keyData += calculateCRC16(keyData);

      if (isEncrypt === true) {
        // do encrypt
      } else {
        keyData = assembleAppendZero(keyData, 48 * 2);
      }

      return keyData;
    }
  };
  /* SEC command end */

  /* OMC command begin */
  var OMC = {
    assemble: function (param) {
      var res = '';

      res = assembleMessageType(res, '0108');
      res += convertDecStrToHexStr(parseInt(param.idleOutput.trim(), 16).toString(10), 8);
      res += convertDecStrToHexStr(parseInt(param.inserviceOutput.trim(), 16).toString(10), 8);
      res += convertDecStrToHexStr(param.mode, 2);
      res += this.assembleValidTime(param.beginHour, param.beginMinute, param.endHour, param.endMinute);
      res += convertDecStrToHexStr(parseInt(param.validIdleOutput.trim(), 16).toString(10), 8);
      res += convertDecStrToHexStr(parseInt(param.validInserviceOutput.trim(), 16).toString(10), 8);

      return res;
    },
    send: function (httpSendRequest, api, param, cb) {
      var cmdObj = {};
      cmdObj.uniqueId = param.uid;
      cmdObj.messageType = 0x01;
      cmdObj.messageSubType = 0x08;
      cmdObj.guiOutputModeConfigCommandRequest = {
        'idleOutput': parseInt(param.idleOutput, 16),
        'inServiceOutput': parseInt(param.inserviceOutput, 16),
        'validTimeIdleOutput': parseInt(param.validIdleOutput, 16),
        'validTimeInServiceOutput': parseInt(param.validInserviceOutput, 16),
        'mode': parseInt(param.mode, 10),
        'validTime': parseInt(this.assembleValidTime(param.beginHour, param.beginMinute, param.endHour, param.endMinute), 16)
      };
      httpSendRequest(api, cmdObj, cb);
    },
    assembleValidTime: function (beginHour, bgeinMinute, endHour, endMinute) {
      var validTime = '00000000000'
        + assemblePadZero(Number(endMinute).toString(2), 6)
        + assemblePadZero(Number(endHour).toString(2), 5)
        + assemblePadZero(Number(bgeinMinute).toString(2), 6)
        + assemblePadZero(Number(beginHour).toString(2), 5);

      return assemblePadZero(parseInt(validTime, 2).toString(16), 8);
    }
  };
  /* OMC command end */

  /* ACW command begin */
  var ACW = {
    assemble: function (param) {
      var res = '';

      res = assembleMessageType(res, '0109');
      res += convertDecStrToHexStr(param.mode, 2);
      res += convertDecStrToHexStr(parseInt(param.pwronEventMask.trim(), 16).toString(10), 2);
      res += convertDecStrToHexStr(parseInt(param.pwroffEventMask.trim(), 16).toString(10), 2);
      res += convertDecStrToHexStr(param.duration, 2);
      res += this.assembleValidTime(param.beginHour, param.beginMinute, param.endHour, param.endMinute);

      return res;
    },
    send: function (httpSendRequest, api, param, cb) {
      var cmdObj = {};
      cmdObj.uniqueId = param.uid;
      cmdObj.messageType = 0x01;
      cmdObj.messageSubType = 0x09;
      cmdObj.guiAirConditionerWorkingConfigCommandRequest = {
        'mode': parseInt(param.mode, 10),
        'powerOnEventMask': parseInt(param.pwronEventMask, 16),
        'powerOffEventMask': parseInt(param.pwroffEventMask, 16),
        'duration': parseInt(param.duration, 10),
        'validTime': parseInt(this.assembleValidTime(param.beginHour, param.beginMinute, param.endHour, param.endMinute), 16)
      };
      httpSendRequest(api, cmdObj, cb);
    },
    assembleValidTime: function (beginHour, bgeinMinute, endHour, endMinute) {
      var validTime = '00000000000'
        + assemblePadZero(Number(endMinute).toString(2), 6)
        + assemblePadZero(Number(endHour).toString(2), 5)
        + assemblePadZero(Number(bgeinMinute).toString(2), 6)
        + assemblePadZero(Number(beginHour).toString(2), 5);

      return assemblePadZero(parseInt(validTime, 2).toString(16), 8);
    }
  };
  /* ACW command end */

  /* DOA command begin */
  var DOA = {
    assemble: function (param) {
      var res = '';

      res = assembleMessageType(res, '0131');
      res += convertDecStrToHexStr(param.mode, 2);
      res += convertDecStrToHexStr(param.type, 2);
      res += convertDecStrToHexStr(param.duration, 2);
      res += convertDecStrToHexStr(param.interval, 2);

      return res;
    },
    send: function (httpSendRequest, api, param, cb) {
      var cmdObj = {};
      cmdObj.uniqueId = param.uid;
      cmdObj.messageType = 0x01;
      cmdObj.messageSubType = 0x31;
      cmdObj.guiDoorAlarmCommandRequest = {
        'doorAlarmMode': parseInt(param.mode.trim(), 10),
        'doorAlarmTrigger': parseInt(param.type.trim(), 10),
        'doorAlarmDuration': parseInt(param.duration.trim(), 10),
        'doorAlarmSendInterval': parseInt(param.interval.trim(), 10)
      };
      httpSendRequest(api, cmdObj, cb);
    }
  };
  /* DOA command end */

  /* SMA command begin */
  var SMA = {
    assemble: function (param) {
      var res = '';

      res = assembleMessageType(res, '0132');
      res += convertDecStrToHexStr(param.mode, 2);
      res += convertDecStrToHexStr(param.threshold, 2);
      res += convertDecStrToHexStr(param.duration, 2);
      res += convertDecStrToHexStr(param.interval, 2);

      return res;
    },
    send: function (httpSendRequest, api, param, cb) {
      var cmdObj = {};
      cmdObj.uniqueId = param.uid;
      cmdObj.messageType = 0x01;
      cmdObj.messageSubType = 0x32;
      cmdObj.guiSmokeAlarmCommandRequest = {
        'smokeAlarmMode': parseInt(param.mode.trim(), 10),
        'smokeAlarmThreshold': parseInt(param.threshold.trim(), 10),
        'smokeAlarmDuration': parseInt(param.duration.trim(), 10),
        'smokeAlarmSendInterval': parseInt(param.interval.trim(), 10)
      };
      httpSendRequest(api, cmdObj, cb);
    }
  };
  /* SMA command end */

  /* OUO command begin */
  var OUO = {
    assemble: function (param) {
      var res = '';

      res = assembleMessageType(res, '0181');
      res += convertDecStrToHexStr(param.orderNum, 2);
      res += convertDecStrToHexStr(param.type, 2);
      res += convertDecStrToHexStr(param.orderID, 8);
      res += convertDecStrToHexStr(param.orderStart, 8);
      res += convertDecStrToHexStr(param.orderExpire, 8);
      res += convertDecStrToHexStr(param.orderPassword, 4);
      res += convertDecStrToHexStr(param.orderPersonNumber, 2);
      res += convertDecStrToHexStr(param.orderPasswordValidConut, 2);

      return res;
    },
    send: function (httpSendRequest, api, param, cb) {
      var cmdObj = {};
      cmdObj.uniqueId = param.uid;
      cmdObj.messageType = 0x01;
      cmdObj.messageSubType = 0x81;
      cmdObj.guiUpdateOrderCommandRequest = {
        'actionType': parseInt(param.type.trim(), 10),
        'orderID': parseInt(param.orderID.trim(), 10),
        'startDateTime': parseInt(param.orderStart.trim(), 10),
        'expireDateTime': parseInt(param.orderExpire.trim(), 10),
        'orderPassword': parseInt(param.orderPassword.trim(), 10),
        'personNumber': parseInt(param.orderPersonNumber.trim(), 10),
        'passwordValidCount': parseInt(param.orderPasswordValidConut.trim(), 10)
      };
      httpSendRequest(api, cmdObj, cb);
    }
  };
  /* OUO command end */

  /* OUT command begin */
  var OUT = {
    assemble: function (param) {
      var res = '';

      res = assembleMessageType(res, '0182');
      res += convertDecStrToHexStr(param.pin, 2);
      res += convertDecStrToHexStr(param.pinValue, 2);
      res += convertDecStrToHexStr(parseInt(param.pinMask.trim(), 16).toString(10), 8);

      return res;
    },
    send: function (httpSendRequest, api, param, cb) {
      var cmdObj = {};
      cmdObj.uniqueId = param.uid;
      cmdObj.messageType = 0x01;
      cmdObj.messageSubType = 0x82;
      cmdObj.outputConfigCommandRequest = {
        'outputNumber': parseInt(param.pin.trim(), 10),
        'outputPin': parseInt(param.pinValue.trim(), 10),
        'controlMask': parseInt(param.pinMask.trim(), 16)
      };
      httpSendRequest(api, cmdObj, cb);
    }
  };
  /* OUT command end */

  /* MUO command begin */
  var MUO = {
    assemble: function (param) {
      var res = '';

      res = assembleMessageType(res, '0183');
      res += this.assembleMode(param.act, param.type);
      res += convertDecStrToHexStr(param.vol, 2);
      res += convertDecStrToHexStr(param.mediaFname, 2);

      return res;
    },
    send: function (httpSendRequest, api, param, cb) {
      var cmdObj = {};
      cmdObj.uniqueId = param.uid;
      cmdObj.messageType = 0x01;
      cmdObj.messageSubType = 0x83;
      cmdObj.guiMultimediaCommandConfigRequest = {
        'mode': parseInt(this.assembleMode(param.act, param.type), 16),
        'volume': parseInt(param.vol.trim(), 10),
        'fileName': parseInt(param.mediaFname.trim(), 10)
      };
      httpSendRequest(api, cmdObj, cb);
    },
    assembleMode: function (act, type) {
      var mode = assemblePadZero(Number(act).toString(2), 4)
        + assemblePadZero(Number(type).toString(2), 4);

      return assemblePadZero(parseInt(mode, 2).toString(16), 2);
    }
  };
  /* MUO command end */

  /* RTO command begin */
  var RTO = {
    assemble: function (param) {
      var res = '';

      res = assembleMessageType(res, '0184');
      res += convertDecStrToHexStr(param.cmd, 2);
      res += convertDecStrToHexStr(param.subCmd, 2);

      return res;
    },
    send: function (httpSendRequest, api, param, cb) {
      var cmdObj = {};
      cmdObj.uniqueId = param.uid;
      cmdObj.messageType = 0x01;
      cmdObj.messageSubType = 0x84;
      cmdObj.rtoCommandRequest = {
        'rtoCommand': parseInt(param.cmd, 10),
        'rtoSubCommand': parseInt(param.subCmd, 10)
      };
      httpSendRequest(api, cmdObj, cb);
    }
  };
  /* RTO command end */

  /* FOTA command begin */
  var FOTA = {
    assemble: function (param) {
      var res = '';

      res = assembleMessageType(res, '01F1');
      res += convertDecStrToHexStr(param.retry, 2);
      res += convertDecStrToHexStr(param.timeout, 2);
      res += convertDecStrToHexStr(param.protocol, 2);
      res += convertDecStrToHexStr(param.urlLen, 2);
      res += convertStrToHexStr(param.url);
      res += convertDecStrToHexStr(param.port, 4);
      res += convertDecStrToHexStr(param.userNameLen, 2);
      res += convertStrToHexStr(param.userName);
      res += convertDecStrToHexStr(param.userPasswdLen, 2);
      res += convertStrToHexStr(param.userPasswd);
      res += assemblePadZero(param.md5.trim(), 32);
      res += convertDecStrToHexStr(parseInt(param.key.trim(), 16).toString(10), 8);
      res += convertDecStrToHexStr(parseInt(param.dwnAddr.trim(), 16).toString(10), 8);
      res += convertDecStrToHexStr(parseInt(param.appAddr.trim(), 16).toString(10), 8);

      return res;
    },
    send: function (httpSendRequest, api, param, cb) {
      var cmdObj = {};
      cmdObj.uniqueId = param.uid;
      cmdObj.messageType = 0x01;
      cmdObj.messageSubType = 0xF1;
      cmdObj.otaCommandRequest = {
        'otaRetryTimes': parseInt(param.retry.trim(), 10),
        'otaDownloadTimeout': parseInt(param.timeout.trim(), 10),
        'otaDownloadProtocol': parseInt(param.protocol.trim(), 10),
        'otaServerUrlLength': param.url.trim().length,
        'otaServerUrl': param.url.trim(),
        'otaServerPort': parseInt(param.port.trim(), 10),
        'otaServerUsernameLength': param.userName.trim().length,
        'otaServerUserName': param.userName.trim(),
        'otaServerPasswordLength': param.userPasswd.trim().length,
        'otaServerPassword': param.userPasswd.trim(),
        'otaServerMD5': assemblePadZero(param.md5.trim(), 32),
        'otaServerKey': parseInt(param.key.trim(), 10),
        'otaDownloadAddress': parseInt(param.dwnAddr.trim(), 16),
        'otaAppBootupAddress': parseInt(param.appAddr.trim(), 16)
      };
      httpSendRequest(api, cmdObj, cb);
    }
  };

  /* FOTA command end */

  function getCommand(cmdType, param) {
    // console.log(cmdType);
    // console.log(param);
    var cmd = 'INVALID INPUT';
    var content = '';
    var uid = param.uid;
    switch (cmdType) {
      case 'APC': {
        content = APC.assemble(param);
        break;
      }
      case 'SER': {
        content = SER.assemble(param);
        break;
      }
      case 'CFG': {
        content = CFG.assemble(param);
        break;
      }
      case 'TMA': {
        content = TMA.assemble(param);
        break;
      }
      case 'DOG': {
        content = DOG.assemble(param);
        break;
      }
      case 'ACO': {
        content = ACO.assemble(param);
        break;
      }
      case 'SEC': {
        content = SEC.assemble(param);
        break;
      }
      case 'OMC': {
        content = OMC.assemble(param);
        break;
      }
      case 'ACW': {
        content = ACW.assemble(param);
        break;
      }
      case 'DOA': {
        content = DOA.assemble(param);
        break;
      }
      case 'SMA': {
        content = SMA.assemble(param);
        break;
      }
      case 'OUO': {
        content = OUO.assemble(param);
        break;
      }
      case 'OUT': {
        content = OUT.assemble(param);
        break;
      }
      case 'MUO': {
        content = MUO.assemble(param);
        break;
      }
      case 'RTO': {
        content = RTO.assemble(param);
        break;
      }
      case 'FOTA': {
        content = FOTA.assemble(param);
        break;
      }
      default:
        return cmd;
    }

    // add header
    cmd = assmebleHeader(uid, content.length / 2);
    cmd += assembleSendtime();
    cmd += assembleSN();
    // add payload
    cmd += content;

    // add tail
    cmd += assembleTail(cmd);

    return cmd.toUpperCase();

    function assmebleHeader(uid, length) {
      var cmdLen = assemblePadZero((length + 4 + 2).toString(16), 4);
      var header = PROTSTART + PROTDEVTYPE + PROTVER + uid + cmdLen;
      header += calculateCRC16(header);

      return header;
    }

    function assembleSendtime() {
      return (Date.parse(new Date()) / 1000).toString(16);
    }

    function assembleSN() {
      return '0001';
    }

    function assembleTail(data) {
      var crcSrc = data.substr(36, data.length - 36);
      return calculateCRC16(crcSrc) + PROTTAIL;
    }
  }

  function sendCommand(cmdType, param, cb) {
    var res = false;

    switch (cmdType) {
      case 'TV_VOL': {
        res = TV_VOL.send(this.httpSendRequest, this.settings.tvVolUpdateAPI, param, cb);
        break;
      }
      case 'TMP': {
        res = TMP.send(this.httpSendRequest, this.settings.tmpConAPI, param, cb);
        break;
      }
      case 'APC': {
        res = APC.send(this.httpSendRequest, this.settings.apcConAPI, param, cb);
        break;
      }
      case 'SER': {
        res = SER.send(this.httpSendRequest, this.settings.serConAPI, param, cb);
        break;
      }
      case 'CFG': {
        res = CFG.send(this.httpSendRequest, this.settings.cfgConAPI, param, cb);
        break;
      }
      case 'TMA': {
        res = TMA.send(this.httpSendRequest, this.settings.tmaConAPI, param, cb);
        break;
      }
      case 'DOG': {
        res = DOG.send(this.httpSendRequest, this.settings.dogConAPI, param, cb);
        break;
      }
      case 'ACO': {
        res = ACO.send(this.httpSendRequest, this.settings.acoConAPI, param, cb);
        break;
      }
      case 'SEC': {
        res = SEC.send(this.httpSendRequest, '', param, cb);
        break;
      }
      case 'OMC': {
        res = OMC.send(this.httpSendRequest, this.settings.omcConAPI, param, cb);
        break;
      }
      case 'ACW': {
        res = ACW.send(this.httpSendRequest, this.settings.acwConAPI, param, cb);
        break;
      }
      case 'DOA': {
        res = DOA.send(this.httpSendRequest, this.settings.doaConAPI, param, cb);
        break;
      }
      case 'SMA': {
        res = SMA.send(this.httpSendRequest, this.settings.smaConAPI, param, cb);
        break;
      }
      case 'OUO': {
        res = OUO.send(this.httpSendRequest, this.settings.ouoConAPI, param, cb);
        break;
      }
      case 'OUT': {
        res = OUT.send(this.httpSendRequest, this.settings.outConAPI, param, cb);
        break;
      }
      case 'MUO': {
        res = MUO.send(this.httpSendRequest, this.settings.muoConAPI, param, cb);
        break;
      }
      case 'RTO': {
        res = RTO.send(this.httpSendRequest, this.settings.rtoConAPI, param, cb);
        break;
      }
      case 'FOTA': {
        res = FOTA.send(this.httpSendRequest, this.settings.fotaAPI, param, cb);
        break;
      }
      default:
        break;
    }
    this.operationLogger.trace(cmdType, param);
    return res;
  }

  function assembleMessageType(data, type) {
    return data + type;
  }

  function convertStrToHexStr(data) {
    var hexArr = [];
    for (var idx = 0; idx < data.length; idx++) {
      hexArr.push(data.charCodeAt(idx).toString(16));
    }
    return hexArr.join('');
  }

  function convertDecStrToHexStr(data, totalLen) {
    return assemblePadZero(parseInt(data, 10).toString(16), totalLen);
  }

  // fill '0' before string
  function assemblePadZero(str, n) {
    var temp = '00000000000000000000000000000000' + str;
    return temp.substr(temp.length - n);
  }

  // append '0' after string
  function assembleAppendZero(str, n) {
    var temp = str + '0000000000000000000000000000000000000000000000000000000000000000';
    return temp.substr(0, n);
  }

  function calculateCRC16(data) {
    var bytes = [];

    var idx;
    // convert hex byte string to byte array
    for (idx = 0; idx < data.length; idx += 2) {
      bytes.push(parseInt(data.substr(idx, 2), 16));
    }

    var crc = 0x1D0F;
    for (idx = 0; idx < bytes.length; idx++) {
      crc = ((crc >>> 8) | (crc << 8)) & 0xffff;
      crc ^= (bytes[idx] & 0xff); // byte to int, trunc sign
      crc ^= ((crc & 0xff) >> 4);
      crc ^= (crc << 12) & 0xffff;
      crc ^= ((crc & 0xFF) << 5) & 0xffff;
    }

    return assemblePadZero(crc.toString(16), 4);
  }

}());
