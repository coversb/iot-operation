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
function DogCommand() {
  BaseCommand.call(this, 'DogCommand');

  this.update = update;

  function update(req, res) {
    var cmd = req.cmdData;

    cmd.name = req.body.name;
    cmd.notes = req.body.notes;
    cmd.sw = req.body.sw;
    cmd.report = req.body.report;
    cmd.interval = req.body.interval;
    cmd.rebootHour = req.body.rebootHour;
    cmd.rebootMinute = req.body.rebootMinute;
    cmd.randomTime = req.body.randomTime;

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

exports.DogCommand = new DogCommand();
