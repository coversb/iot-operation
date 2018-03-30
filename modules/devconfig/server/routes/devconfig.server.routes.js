'use strict';

/**
 * Module dependencies
 */
var devconfigPolicy = require('../policies/devconfig.server.policy'),
  APC = require('../controllers/devconfig.server.apc.controller'),
  SER = require('../controllers/devconfig.server.ser.controller'),
  CFG = require('../controllers/devconfig.server.cfg.controller'),
  TMA = require('../controllers/devconfig.server.tma.controller');

module.exports = function (app) {
  /**
   * APC routers
   */
  app.route('/api/devconfig/apc').all(devconfigPolicy.isAllowed)
    .get(APC.ApcCommand.list)
    .post(APC.ApcCommand.create);
  app.route('/api/devconfig/apc/:apcId').all(devconfigPolicy.isAllowed)
    .get(APC.ApcCommand.read)
    .put(APC.ApcCommand.update)
    .delete(APC.ApcCommand.delete);
  app.param('apcId', APC.ApcCommand.commandByID);

  /**
   * SER routers
   */
  app.route('/api/devconfig/ser').all(devconfigPolicy.isAllowed)
    .get(SER.SerCommand.list)
    .post(SER.SerCommand.create);
  app.route('/api/devconfig/ser/:serId').all(devconfigPolicy.isAllowed)
    .get(SER.SerCommand.read)
    .put(SER.SerCommand.update)
    .delete(SER.SerCommand.delete);
  app.param('serId', SER.SerCommand.commandByID);

  /**
   * CFG routers
   */
  app.route('/api/devconfig/cfg').all(devconfigPolicy.isAllowed)
    .get(CFG.CfgCommand.list)
    .post(CFG.CfgCommand.create);
  app.route('/api/devconfig/cfg/:cfgId').all(devconfigPolicy.isAllowed)
    .get(CFG.CfgCommand.read)
    .put(CFG.CfgCommand.update)
    .delete(CFG.CfgCommand.delete);
  app.param('cfgId', CFG.CfgCommand.commandByID);

  /**
   * TMA routers
   */
  app.route('/api/devconfig/tma').all(devconfigPolicy.isAllowed)
    .get(TMA.TmaCommand.list)
    .post(TMA.TmaCommand.create);
  app.route('/api/devconfig/tma/:tmaId').all(devconfigPolicy.isAllowed)
    .get(TMA.TmaCommand.read)
    .put(TMA.TmaCommand.update)
    .delete(TMA.TmaCommand.delete);
  app.param('tmaId', TMA.TmaCommand.commandByID);
};