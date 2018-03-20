const JobRunner = require('./job_runner');

module.exports.init = function init(agenda) {
  agenda.define('job-1', (job, done) => {
    const jobRunner = new JobRunner(job);
    jobRunner.run();
    console.log("job-1 data:", job.attrs.data);
    setTimeout(() => {
      jobRunner.destroy();
      done()
    }, 60000)
  });

};
