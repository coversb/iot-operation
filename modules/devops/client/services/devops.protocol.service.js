(function () {
  'use strict';

  // DevopsProt service for devops

  angular
    .module('devops.prot.services')
    .factory('DevopsProt', DevopsProt);

  function DevopsProt() {
    var prot = {
      getCommand: getCommand
    };

    return prot;
  }

  function getCommand(cmdType, param) {
    var cmd = 'INVALID INPUT';
    switch (cmdType) {
      case 'RTO': {
        // console.log(param);
        cmd = 'RTO COMMAND';
        break;
      }
      default:
        break;
    }

    // add header

    // add payload

    // add tail

    return cmd;
  }

}());
