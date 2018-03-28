'use strict';

/**
 * Module dependencies
 */
var devconfigPolicy = require('../policies/devconfig.server.policy'),
  devconfigApcController = require('../controllers/devconfig.server.apc.controller'),
  SER = require('../controllers/devconfig.server.ser.controller');

module.exports = function (app) {
  /**
   * APC routers
   */
  app.route('/api/devconfig/apc').all(devconfigPolicy.isAllowed)
    .get(devconfigApcController.list)
    .post(devconfigApcController.create);
  app.route('/api/devconfig/apc/:apcId').all(devconfigPolicy.isAllowed)
    .get(devconfigApcController.read)
    .put(devconfigApcController.update)
    .delete(devconfigApcController.delete);
  app.param('apcId', devconfigApcController.apcCommandByID);

  /**
   * SER routers
   */
  // console.log(SER);
  app.route('/api/devconfig/ser').all(devconfigPolicy.isAllowed)
    .get(SER.SerCommand.list)
    .post(SER.SerCommand.create);
  app.route('/api/devconfig/ser/:serId').all(devconfigPolicy.isAllowed)
    .get(SER.SerCommand.read)
    .put(SER.SerCommand.update)
    .delete(SER.SerCommand.delete);
  app.param('serId', SER.SerCommand.commandByID);
};
