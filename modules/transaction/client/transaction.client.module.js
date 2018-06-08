(function (app) {
  'use strict';

  app.registerModule('transaction', ['core']);
  app.registerModule('transaction.routes', ['ui.router', 'core.routes']);
  app.registerModule('transaction.cleaner-manage');
  app.registerModule('transaction.client.services');
}(ApplicationConfiguration));
