'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config'));

const filesRouter = require('angular-filemanager-bridge').router;

/**
 * Upgrades module init function.
 */
module.exports = function (app, db) {

  app.use('/files/', filesRouter);
};
