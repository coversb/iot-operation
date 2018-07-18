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
function AcwCommand() {
  BaseCommand.call(this, 'AcwCommand');

  this.update = update;

  function update(req, res) {
    var cmd = req.cmdData;

    cmd.name = req.body.name;
    cmd.notes = req.body.notes;
    cmd.mode = req.body.mode;
    cmd.pwrOnEventMask = req.body.pwrOnEventMask;
    cmd.pwrOffEventMask = req.body.pwrOffEventMask;
    cmd.duration = req.body.duration;
    cmd.beginHour = req.body.beginHour;
    cmd.beginMinute = req.body.beginMinute;
    cmd.endHour = req.body.endHour;
    cmd.endMinute = req.body.endMinute;

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

exports.AcwCommand = new AcwCommand();
