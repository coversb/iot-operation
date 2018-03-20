const JobRunner = require('./job_runner');

module.exports.init = function init(agenda) {
  agenda.define('job-2', (job, done) => {
    const jobRunner = new JobRunner(job);
    jobRunner.run();
    setTimeout(() => {
      jobRunner.destroy();
      done()
    }, 60000)
  });
};
