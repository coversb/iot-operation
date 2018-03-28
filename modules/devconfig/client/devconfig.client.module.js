(function (app) {
  'use strict';

  app.registerModule('devconfig', ['core']);
  app.registerModule('devconfig.routes', ['ui.router', 'core.routes']);
  app.registerModule('devconfig.configuration');
  app.registerModule('devconfig.management');
  app.registerModule('devconfig.management.service');
}(ApplicationConfiguration));
