'use strict';

const jobone = require('./jobs/job_1');
const jobtwo = require('./jobs/job_2');

module.exports.init = function init(agenda) {

  agenda.on('ready', () => {
    jobone.init(agenda);
    jobtwo.init(agenda);
    agenda.start();
  });

  agenda.on('complete', (job) => {
    console.log('Job finished', job.attrs);
  });

  agenda.on('fail', (error, job) => {
    console.error('Error in agenda job:', job.attrs.failReason, error);
    console.error('Error in agenda job details:', JSON.stringify(job.attrs));
  });

  function graceful() {
    agenda.stop(() => {
      process.exit(0);
    });
  }

  process.on('SIGTERM', graceful);
  process.on('SIGINT', graceful);
};
