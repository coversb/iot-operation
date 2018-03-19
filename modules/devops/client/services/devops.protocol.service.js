(function () {
  'use strict';

  // DevopsProt service for devops

  angular
    .module('devops.prot.services')
    .factory('DevopsProt', DevopsProt);

  var PROTVER = '0114'; // protocol version V1.20
  var PROTDEVTYPE = '01'; // device type
  var PROTSTART = '2B5042'; // protocol starter '+PB'
  var PROTTAIL = '0D0A';

  function DevopsProt() {
    var prot = {
      getCommand: getCommand
    };

    return prot;
  }

  function getCommand(cmdType, param) {
    console.log(cmdType);
    console.log(param);
    var cmd = 'INVALID INPUT';
    var content = '';
    var uid = param.uid;
    switch (cmdType) {
      case 'APC': {
        content = assembleAPC(param);
        break;
      }
      case 'SER': {
        content = assembleSER(param);
        break;
      }
      case 'CFG': {
        content = assembleCFG(param);
        break;
      }
      case 'TMA': {
        content = assembleTMA(param);
        break;
      }
      case 'DOG': {
        content = assembleDOG(param);
        break;
      }
      case 'ACO': {
        content = assembleACO(param);
        break;
      }
      case 'SEC': {
        content = assembleSEC(param);
        break;
      }
      case 'OMC': {
        content = assembleOMC(param);
        break;
      }
      case 'DOA': {
        content = assembleDOA(param);
        break;
      }
      case 'SMA': {
        content = assembleSMA(param);
        break;
      }
      case 'OUO': {
        content = assembleOUO(param);
        break;
      }
      case 'OUT': {
        content = assembleOUT(param);
        break;
      }
      case 'MUO': {
        content = assembleMUO(param);
        break;
      }
      case 'RTO': {
        content = assembleRTO(param);
        break;
      }
      case 'FOTA': {
        content = assembleFOTA(param);
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
  }

  /* assemble command content begin */
  function assembleAPC(param) {
    var res = '';

    res = assembleMessageType(res, '0101');
    res += assembleFiledLength(param.apn.trim().length, param.apnUserName.trim().length, param.apnPassword.trim().length);
    res += convertStrToHexStr(param.apn.trim());
    res += convertStrToHexStr(param.apnUserName.trim());
    res += convertStrToHexStr(param.apnPassword.trim());
    res += assembleIP(param.mainDNS);
    res += assembleIP(param.backupDNS);

    return res;

    function assembleFiledLength(apnLen, apnUsrNameLen, apnPasswordLen) {
      var filedLen = assemblePadZero(apnPasswordLen.toString(2), 5)
        + assemblePadZero(apnUsrNameLen.toString(2), 5)
        + assemblePadZero(apnLen.toString(2), 6);

      return assemblePadZero(parseInt(filedLen, 2).toString(16), 4);
    }

    function assembleIP(ip) {
      var ipAddr = convertDecStrToHexStr(ip[0], 2)
        + convertDecStrToHexStr(ip[1], 2)
        + convertDecStrToHexStr(ip[2], 2)
        + convertDecStrToHexStr(ip[3], 2);
      return ipAddr
    }
  }

  function assembleSER(param) {
    var res = '';

    res = assembleMessageType(res, '0102');
    res += assembleFiledLength(param.mainServer.trim().length, param.backupServer.trim().length, param.sms.trim().length);
    res += convertDecStrToHexStr(param.mode, 2);
    res += convertStrToHexStr(param.mainServer.trim());
    res += convertDecStrToHexStr(param.mainPort, 4);
    res += convertStrToHexStr(param.backupServer.trim());
    res += convertDecStrToHexStr(param.backupPort, 4);
    res += convertStrToHexStr(param.sms.trim());
    res += convertDecStrToHexStr(param.hbpInterval, 2);
    res += convertDecStrToHexStr(param.maxRandomTime, 4);

    return res;

    function assembleFiledLength(mainServerLen, backupServerLen, smsLen) {
      var filedLen = '0000000'
        + assemblePadZero(smsLen.toString(2), 5)
        + assemblePadZero(backupServerLen.toString(2), 6)
        + assemblePadZero(mainServerLen.toString(2), 6);

      return assemblePadZero(parseInt(filedLen, 2).toString(16), 6);
    }
  }

  function assembleCFG(param) {
    var res = '';

    res = assembleMessageType(res, '0103');
    res += convertDecStrToHexStr(parseInt(param.mask.trim(), 16).toString(10), 4);
    res += convertDecStrToHexStr(param.infInterval.trim(), 4);

    return res;
  }

  function assembleTMA(param) {
    var res = '';

    res = assembleMessageType(res, '0104');
    res += assembleTimeAdjust(param.autoAdjust);
    res += convertDecStrToHexStr(param.utc, 8);

    return res;

    function assembleTimeAdjust(autoAdjust) {
      var tmaMode = assemblePadZero(Number(autoAdjust).toString(2), 3)
        + '0000000000000';

      return assemblePadZero(parseInt(tmaMode, 2).toString(16), 4);
    }
  }

  function assembleDOG(param) {
    var res = '';

    res = assembleMessageType(res, '0105');
    res += assembleMode(param.sw, param.report, param.interval);
    res += assembleRebootTime(param.rebootHour, param.rebootMinute);
    res += convertDecStrToHexStr(param.randomTime, 4);

    return res;

    function assembleMode(sw, report, interval) {
      var dogMode = assemblePadZero(Number(interval).toString(2), 5)
        + assemblePadZero(Number(report).toString(2), 1)
        + assemblePadZero(Number(sw).toString(2), 2);

      return assemblePadZero(parseInt(dogMode, 2).toString(16), 2);
    }

    function assembleRebootTime(hour, minute) {
      var dogRebootTime = '00000'
        + assemblePadZero(Number(hour).toString(2), 5)
        + assemblePadZero(Number(minute).toString(2), 6);

      return assemblePadZero(parseInt(dogRebootTime, 2).toString(16), 4);
    }
  }

  function assembleACO(param) {
    var res = '';

    res = assembleMessageType(res, '0106');
    res += assembleMode(param.pwrMode, param.workMode, param.wind);
    res += convertDecStrToHexStr(param.interval, 2);
    res += convertDecStrToHexStr(param.duration, 2);
    res += convertDecStrToHexStr(param.temperature, 2);

    return res;

    function assembleMode(pwrMode, workMode, wind) {
      var devAirConMode = '00'
        + assemblePadZero(Number(wind).toString(2), 2)
        + assemblePadZero(Number(workMode).toString(2), 2)
        + assemblePadZero(Number(pwrMode).toString(2), 2);

      return assemblePadZero(parseInt(devAirConMode, 2).toString(16), 2);
    }
  }

  function assembleSEC(param) {
    console.log('SEC NOT IMPLEMENT');
    var res = '';

    res = assembleMessageType(res, '0107');

    return res;
  }

  function assembleOMC(param) {
    var res = '';

    res = assembleMessageType(res, '0108');
    res += convertDecStrToHexStr(parseInt(param.idleOutput.trim(), 16).toString(10), 8);
    res += convertDecStrToHexStr(parseInt(param.inserviceOutput.trim(), 16).toString(10), 8);
    res += convertDecStrToHexStr(param.mode, 2);
    res += assembleValidTime(param.beginHour, param.beginMinute, param.endHour, param.endMinute);
    res += convertDecStrToHexStr(parseInt(param.validIdleOutput.trim(), 16).toString(10), 8);
    res += convertDecStrToHexStr(parseInt(param.validInserviceOutput.trim(), 16).toString(10), 8);

    return res;

    function assembleValidTime(beginHour, bgeinMinute, endHour, endMinute) {
      var validTime = '00000000000'
        + assemblePadZero(Number(endMinute).toString(2), 6)
        + assemblePadZero(Number(endHour).toString(2), 5)
        + assemblePadZero(Number(bgeinMinute).toString(2), 6)
        + assemblePadZero(Number(beginHour).toString(2), 5);

      return assemblePadZero(parseInt(validTime, 2).toString(16), 8);
    }
  }

  function assembleDOA(param) {
    var res = '';

    res = assembleMessageType(res, '0131');
    res += convertDecStrToHexStr(param.mode, 2);
    res += convertDecStrToHexStr(param.type, 2);
    res += convertDecStrToHexStr(param.duration, 2);
    res += convertDecStrToHexStr(param.interval, 2);

    return res;
  }

  function assembleSMA(param) {
    var res = '';

    res = assembleMessageType(res, '0132');
    res += convertDecStrToHexStr(param.mode, 2);
    res += convertDecStrToHexStr(param.threshold, 2);
    res += convertDecStrToHexStr(param.duration, 2);
    res += convertDecStrToHexStr(param.interval, 2);

    return res;
  }

  function assembleOUO(param) {
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
  }

  function assembleOUT(param) {
    var res = '';

    res = assembleMessageType(res, '0182');
    res += convertDecStrToHexStr(param.pin, 2);
    res += convertDecStrToHexStr(param.pinValue, 2);
    res += convertDecStrToHexStr(parseInt(param.pinMask.trim(), 16).toString(10), 8);

    return res;
  }

  function assembleMUO(param) {
    var res = '';

    res = assembleMessageType(res, '0183');
    res += assembleMode(param.act, param.type);
    res += convertDecStrToHexStr(param.vol, 2);
    res += convertDecStrToHexStr(param.mediaFname, 2);

    return res;

    function assembleMode(act, type) {
      var mode = assemblePadZero(Number(act).toString(2), 4)
        + assemblePadZero(Number(type).toString(2), 4);

      return assemblePadZero(parseInt(mode, 2).toString(16), 2);
    }
  }

  function assembleRTO(param) {
    var res = '';

    res = assembleMessageType(res, '0184');
    res += convertDecStrToHexStr(param.cmd, 2);
    res += convertDecStrToHexStr(param.subCmd, 2);

    return res;
  }

  function assembleFOTA(param) {
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
  }

  /* assemble command content end */

  function assembleMessageType(data, type) {
    return data + type;
  }

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

}());
