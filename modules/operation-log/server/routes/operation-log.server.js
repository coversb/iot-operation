'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  log4js = require('log4js');

log4js.configure(path.resolve('./config/operation-log.json'));
var protLogger = log4js.getLogger('prot');
/**
 * Logger API dependencies
 */
module.exports = function (app) {
  // trace protocol command log
  app.route('/api/operation-log/protocol').post(function (req, res) {
    protLogger.trace(req.body);
    res.sendStatus(200);
  });
};
