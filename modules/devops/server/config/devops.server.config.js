'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config'));
var LoadAgenda = require('../lib/agenda/agenda');
// const Agenda = require('agenda');
var Agendash = require('agendash');
var worker = require('../lib/agenda/worker');

/**
 * Module init function.
 */
module.exports = function (app) {

  const agenda = LoadAgenda.get(config);
  app.use('/agendash', Agendash(agenda));

  worker.init(agenda);
};
