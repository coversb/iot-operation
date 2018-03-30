'use strict';

/**
 * Module dependencies
 */
var BaseCommand = require('./devconfig.server.base.controller');


function ApcCommand() {
  BaseCommand.call(this, 'ApcCommand');

  this.update = update;

  function update(req, res) {
    var cmd = req.cmdData;

    cmd.name = req.body.name;
    cmd.notes = req.body.notes;
    cmd.apn = req.body.apn;
    cmd.userName = req.body.apnUserName;
    cmd.password = req.body.apnPassword;
    cmd.mainDNS = req.body.mainDNS;
    cmd.backupDNS = req.body.backupDNS;

    cmd.save(function (err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(cmd);
      }
    });
  };
}

exports.ApcCommand = new ApcCommand();

