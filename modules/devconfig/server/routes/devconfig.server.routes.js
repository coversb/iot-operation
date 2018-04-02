'use strict';

/**
 * Module dependencies
 */
var devconfigPolicy = require('../policies/devconfig.server.policy'),
  APC = require('../controllers/devconfig.server.apc.controller'),
  SER = require('../controllers/devconfig.server.ser.controller'),
  CFG = require('../controllers/devconfig.server.cfg.controller'),
  TMA = require('../controllers/devconfig.server.tma.controller'),
  DOG = require('../controllers/devconfig.server.dog.controller'),
  ACO = require('../controllers/devconfig.server.aco.controller'),
  OMC = require('../controllers/devconfig.server.omc.controller'),
  DOA = require('../controllers/devconfig.server.doa.controller'),
  SMA = require('../controllers/devconfig.server.sma.controller');

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

  /**
   * DOG routers
   */
  app.route('/api/devconfig/dog').all(devconfigPolicy.isAllowed)
    .get(DOG.DogCommand.list)
    .post(DOG.DogCommand.create);
  app.route('/api/devconfig/dog/:dogId').all(devconfigPolicy.isAllowed)
    .get(DOG.DogCommand.read)
    .put(DOG.DogCommand.update)
    .delete(DOG.DogCommand.delete);
  app.param('dogId', DOG.DogCommand.commandByID);

  /**
   * ACO routers
   */
  app.route('/api/devconfig/aco').all(devconfigPolicy.isAllowed)
    .get(ACO.AcoCommand.list)
    .post(ACO.AcoCommand.create);
  app.route('/api/devconfig/aco/:acoId').all(devconfigPolicy.isAllowed)
    .get(ACO.AcoCommand.read)
    .put(ACO.AcoCommand.update)
    .delete(ACO.AcoCommand.delete);
  app.param('acoId', ACO.AcoCommand.commandByID);

  /**
   * OMC routers
   */
  app.route('/api/devconfig/omc').all(devconfigPolicy.isAllowed)
    .get(OMC.OmcCommand.list)
    .post(OMC.OmcCommand.create);
  app.route('/api/devconfig/omc/:omcId').all(devconfigPolicy.isAllowed)
    .get(OMC.OmcCommand.read)
    .put(OMC.OmcCommand.update)
    .delete(OMC.OmcCommand.delete);
  app.param('omcId', OMC.OmcCommand.commandByID);

  /**
   * DOA routers
   */
  app.route('/api/devconfig/doa').all(devconfigPolicy.isAllowed)
    .get(DOA.DoaCommand.list)
    .post(DOA.DoaCommand.create);
  app.route('/api/devconfig/doa/:doaId').all(devconfigPolicy.isAllowed)
    .get(DOA.DoaCommand.read)
    .put(DOA.DoaCommand.update)
    .delete(DOA.DoaCommand.delete);
  app.param('doaId', DOA.DoaCommand.commandByID);

  /**
   * SMA routers
   */
  app.route('/api/devconfig/sma').all(devconfigPolicy.isAllowed)
    .get(SMA.SmaCommand.list)
    .post(SMA.SmaCommand.create);
  app.route('/api/devconfig/sma/:smaId').all(devconfigPolicy.isAllowed)
    .get(SMA.SmaCommand.read)
    .put(SMA.SmaCommand.update)
    .delete(SMA.SmaCommand.delete);
  app.param('smaId', SMA.SmaCommand.commandByID);

};
