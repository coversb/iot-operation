(function (app) {
  'use strict';

  app.registerModule('monitor', ['core']);
  app.registerModule('monitor.routes', ['ui.router', 'core.routes']);
}(ApplicationConfiguration));
