'use strict';

const Agenda = require('agenda');

module.exports.get = function (config) {
  const agendaConfig = {
    db: { address: config.db.uri.replace('angularfullstack', 'agenda_test_dev') },
    defaultConcurrency: config.db.concurrent
  };

  console.log('Starting agenda with config:', agendaConfig);
  return new Agenda(agendaConfig);
};
