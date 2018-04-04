'use strict';

const jobone = require('./jobs/airCron');

module.exports.init = function init(agenda) {

  jobone.init(agenda);

  agenda.on('ready', function () {

    agenda.start();
  });

  agenda.on('complete', function (job) {
    console.log('Job finished', job.attrs);
  });

  agenda.on('fail', function (error, job) {
    console.error('Error in agenda job:', job.attrs.failReason, error);
    console.error('Error in agenda job details:', JSON.stringify(job.attrs));
  });

  function graceful() {
    agenda.stop(function () {
      process.exit(0);
    });
  }

  process.on('SIGTERM', graceful);
  process.on('SIGINT', graceful);
};
