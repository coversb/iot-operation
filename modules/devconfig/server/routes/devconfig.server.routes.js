'use strict';

/**
 * Module dependencies
 */
var devconfigPolicy = require('../policies/devconfig.server.policy'),
  devconfigApcController = require('../controllers/devconfig.server.apc.controller');

module.exports = function (app) {
  // Versions collection routes
  app.route('/api/devconfig/apc').all(devconfigPolicy.isAllowed)
    .get(devconfigApcController.list)
    .post(devconfigApcController.create);

  // Single version routes
  app.route('/api/devconfig/apc/:apcId').all(devconfigPolicy.isAllowed)
    .get(devconfigApcController.read)
    .put(devconfigApcController.update)
    .delete(devconfigApcController.delete);

  // Finish by binding the version middleware
  app.param('apcId', devconfigApcController.apcCommandByID);
};
