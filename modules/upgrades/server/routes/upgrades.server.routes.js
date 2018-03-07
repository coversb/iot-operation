'use strict';

/**
 * Module dependencies
 */
var upgradesPolicy = require('../policies/upgrades.server.policy'),
  upgrades = require('../controllers/upgrades.server.controller');

// const filesRouter = require('angular-filemanager-nodejs-bridge').router;
// const routes = express.Router();

module.exports = function(app) {

  // routes.use('/files', filesRouter);
  // Upgrades Routes
  app.route('/api/upgrades').all(upgradesPolicy.isAllowed)
    .get(upgrades.list)
    .post(upgrades.create);

  app.route('/api/upgrades/:upgradeId').all(upgradesPolicy.isAllowed)
    .get(upgrades.read)
    .put(upgrades.update)
    .delete(upgrades.delete);

  // Finish by binding the Upgrade middleware
  app.param('upgradeId', upgrades.upgradeByID);
};
