(function (app) {
  'use strict';

  app.registerModule('upgrades', ['core']);
  app.registerModule('upgrades.routes', ['ui.router', 'core.routes']);
  app.registerModule('upgrades.versions');
  app.registerModule('upgrades.versions.services');
}(ApplicationConfiguration));
