'use strict';

/* eslint comma-dangle:[0, "only-multiline"] */

module.exports = {
  client: {
    lib: {
      css: [
        // bower:css
        'public/lib/bootstrap/dist/css/bootstrap.min.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
        'public/lib/angular-ui-notification/dist/angular-ui-notification.min.css',
        'public/lib/angular-cron-jobs/dist/angular-cron-jobs.min.css',
        'public/lib/bootstrap-table/src/bootstrap-table.css',
        // endbower
      ],
      js: [
        // bower:js
        'public/lib/angular/angular.min.js',
        'public/lib/angular-animate/angular-animate.min.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'public/lib/angular-messages/angular-messages.min.js',
        'public/lib/angular-translate/angular-translate.min.js',
        'public/lib/jquery/dist/jquery.min.js',
        'public/lib/ng-file-upload/ng-file-upload.min.js',
        'public/lib/angular-mocks/angular-mocks.js',
        'public/lib/angular-resource/angular-resource.min.js',
        'public/lib/angular-sanitize/angular-sanitize.min.js',
        'public/lib/angular-ui-notification/dist/angular-ui-notification.min.js',
        'public/lib/angular-ui-router/release/angular-ui-router.min.js',
        'public/lib/angular-css/angular-css.min.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/angular-cron-jobs/dist/angular-cron-jobs.min.js',
        'public/lib/bootstrap-table/src/bootstrap-table.js',
        // endbower

        // bootstrap
        'public/lib/bootstrap/dist/js/bootstrap.js',

        // angular-filemanager
        'public/lib/angular-filemanager/dist/angular-filemanager.min.js'
      ]
    },
    css: 'public/dist/application*.min.css',
    js: 'public/dist/application*.min.js'
  }
};
