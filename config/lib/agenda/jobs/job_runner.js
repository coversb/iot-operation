'use strict';

const Debug = require('debug');

class JobRunner {
  constructor(job) {
    this.job = job;
    this.logger = Debug(`job:${this.job.attrs._id}`);
  }

  run() {
    this.log();
  }

  log() {
    this.logger('running');
    this.logger("job-1 data:", this.job.attrs.data);
    this.timeout = setTimeout(() => {
      this.log();
    }, 1000)
  }

  destroy() {
    if (this.timeout) clearTimeout(this.timeout);
  }
}

module.exports = JobRunner;
