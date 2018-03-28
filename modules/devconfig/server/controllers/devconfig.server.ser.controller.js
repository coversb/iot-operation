'use strict';

/**
 * Module dependencies
 */
var BaseCommand = require('./devconfig.server.base.controller');

/**
 * Create
 */
function SerCommand (){
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
  };
}
/*
(function(){
  // 创建一个没有实例方法的类
  var Super = function(){};
  Super.prototype = BaseCommand.prototype;
  //将实例作为子类的原型
  SerCommand.prototype = new Super();
})();
*/

exports.SerCommand = new SerCommand();



