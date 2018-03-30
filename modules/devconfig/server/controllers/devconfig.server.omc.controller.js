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
function OmcCommand() {
  BaseCommand.call(this, 'OmcCommand');

  this.update = update;

  function update(req, res) {
    var cmd = req.cmdData;

    cmd.name = req.body.name;
    cmd.notes = req.body.notes;
    cmd.idleOutput = req.body.idleOutput;
    cmd.inserviceOutput = req.body.inserviceOutput;
    cmd.mode = req.body.mode;
    cmd.beginHour = req.body.beginHour;
    cmd.beginMinute = req.body.beginMinute;
    cmd.endHour = req.body.endHour;
    cmd.endMinute = req.body.endMinute;
    cmd.validIdleOutput = req.body.validIdleOutput;
    cmd.validInserviceOutput = req.body.validInserviceOutput;

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

exports.OmcCommand = new OmcCommand();
