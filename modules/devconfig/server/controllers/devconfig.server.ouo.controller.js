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
function OuoCommand() {
  BaseCommand.call(this, 'OuoCommand');

  this.update = update;

  function update(req, res) {
    var cmd = req.cmdData;

    cmd.name = req.body.name;
    cmd.notes = req.body.notes;
    cmd.orderNum = req.body.orderNum;
    cmd.type = req.body.type;
    cmd.orderID = req.body.orderID;
    cmd.orderStart = req.body.orderStart;
    cmd.orderExpire = req.body.orderExpire;
    cmd.orderPassword = req.body.orderPassword;
    cmd.orderPersonNumber = req.body.orderPersonNumber;
    cmd.orderPasswordValidConut = req.body.orderPasswordValidConut;

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

exports.OuoCommand = new OuoCommand();
