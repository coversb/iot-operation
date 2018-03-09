'use strict';

/**
 * Module dependencies
 */
var upgradesVersionsPolicy = require('../policies/upgrades.versions.server.policy'),
  upgradesVersions = require('../controllers/upgrades.versions.server.controller');

module.exports = function (app) {
  // Versions collection routes
  app.route('/api/upgrades/versions').all(upgradesVersionsPolicy.isAllowed)
    .get(upgradesVersions.list)
    .post(upgradesVersions.create);


  // Single version routes
  app.route('/api/upgrades/versions/:versionsId').all(upgradesVersionsPolicy.isAllowed)
    .get(upgradesVersions.read)
    .put(upgradesVersions.update)
    .delete(upgradesVersions.delete);

  // Finish by binding the version middleware
  app.param('versionsId', upgradesVersions.versionByID);
};
