const JobRunner = require('./job_runner');

module.exports.init = function init(agenda) {
  agenda.define('airCon', function (job, done) {
    const jobRunner = new JobRunner(job);
    jobRunner.run();
    console.log("job-1 data:", job.attrs.data);
    setTimeout(function () {
      jobRunner.destroy();
      done()
    }, 60000)
  });

};
