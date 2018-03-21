(function (app) {
  'use strict';

  app.registerModule('devops', ['core']);
  app.registerModule('devops.tools', ['core']);
  app.registerModule('devops.tasks', ['core', 'angular-cron-jobs']);
  app.registerModule('devops.protcmd', ['core']);
  app.registerModule('devops.functiontest', ['core']);
  app.registerModule('devops.routes', ['ui.router', 'core.routes']);
  app.registerModule('devops.services');
  app.registerModule('devops.prot.services');
  app.registerModule('devops.tasks.services');
}(ApplicationConfiguration));
