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
function AcoCommand() {
  BaseCommand.call(this, 'AcoCommand');

  this.update = update;

  function update(req, res) {
    var cmd = req.cmdData;

    cmd.name = req.body.name;
    cmd.notes = req.body.notes;
    cmd.pwrMode = req.body.pwrMode;
    cmd.workMode = req.body.workMode;
    cmd.wind = req.body.wind;
    cmd.interval = req.body.interval;
    cmd.duration = req.body.duration;
    cmd.temperature = req.body.temperature;

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

/*
(function(){
  // 创建一个没有实例方法的类
  var Super = function(){};
  Super.prototype = BaseCommand.prototype;
  //将实例作为子类的原型
  SerCommand.prototype = new Super();
})();
*/

exports.AcoCommand = new AcoCommand();
