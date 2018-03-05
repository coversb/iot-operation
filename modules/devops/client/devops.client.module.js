(function (app) {
  'use strict';

  app.registerModule('devops', ['core']);
  app.registerModule('devops.tools', ['core']);
  app.registerModule('devops.routes', ['ui.router', 'core.routes']);
  app.registerModule('devops.services');
}(ApplicationConfiguration));
