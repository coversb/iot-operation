'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  BaseCommand = require('./devconfig.server.base.controller');

/**
 * Create
 */
function SerCommand() {
  BaseCommand.call(this, 'SerCommand');

  this.update = update;

  function update(req, res) {
    var cmd = req.cmdData;

    cmd.name = req.body.name;
    cmd.notes = req.body.notes;
    cmd.mode = req.body.mode;
    cmd.mainServer = req.body.mainServer;
    cmd.mainPort = req.body.mainPort;
    cmd.backupServer = req.body.backupServer;
    cmd.backupPort = req.body.backupPort;
    cmd.sms = req.body.sms;
    cmd.hbpInterval = req.body.hbpInterval;
    cmd.maxRandomTime = req.body.maxRandomTime;

    cmd.save(function (err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(cmd);
      }
    });
  }
}

exports.SerCommand = new SerCommand();
