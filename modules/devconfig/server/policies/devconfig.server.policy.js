'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Upgrades Versions Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin', '开发/测试'],
    allows: [{
      resources: [
        '/api/devconfig/apc',
        '/api/devconfig/tmp',
        '/api/devconfig/ser',
        '/api/devconfig/cfg',
        '/api/devconfig/tma',
        '/api/devconfig/dog',
        '/api/devconfig/aco',
        '/api/devconfig/sec',
        '/api/devconfig/omc',
        '/api/devconfig/doa',
        '/api/devconfig/sma',
        '/api/devconfig/ouo',
        '/api/devconfig/out',
        '/api/devconfig/muo',
        '/api/devconfig/rto'
      ],
      permissions: '*'
    }, {
      resources: [
        '/api/devconfig/apc/:apcId',
        '/api/devconfig/tmp/:tmpId',
        '/api/devconfig/ser/:serId',
        '/api/devconfig/cfg/:cfgId',
        '/api/devconfig/tma/:tmaId',
        '/api/devconfig/dog/:dogId',
        '/api/devconfig/aco/:acoId',
        '/api/devconfig/sec/:secId',
        '/api/devconfig/omc/:omcId',
        '/api/devconfig/doa/:doaId',
        '/api/devconfig/sma/:smaId',
        '/api/devconfig/ouo/:ouoId',
        '/api/devconfig/out/:outId',
        '/api/devconfig/muo/:muoId',
        '/api/devconfig/rto/:rtoId'
      ],
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: [
        '/api/devconfig/apc',
        '/api/devconfig/tmp',
        '/api/devconfig/ser',
        '/api/devconfig/cfg',
        '/api/devconfig/tma',
        '/api/devconfig/dog',
        '/api/devconfig/aco',
        '/api/devconfig/sec',
        '/api/devconfig/omc',
        '/api/devconfig/doa',
        '/api/devconfig/sma',
        '/api/devconfig/ouo',
        '/api/devconfig/out',
        '/api/devconfig/muo',
        '/api/devconfig/rto'
      ],
      permissions: ['get']
    }, {
      resources: [
        '/api/devconfig/apc/:apcId',
        '/api/devconfig/tmp/:tmpId',
        '/api/devconfig/ser/:serId',
        '/api/devconfig/cfg/:cfgId',
        '/api/devconfig/tma/:tmaId',
        '/api/devconfig/dog/:dogId',
        '/api/devconfig/aco/:acoId',
        '/api/devconfig/sec/:secId',
        '/api/devconfig/omc/:omcId',
        '/api/devconfig/doa/:doaId',
        '/api/devconfig/sma/:smaId',
        '/api/devconfig/ouo/:ouoId',
        '/api/devconfig/out/:outId',
        '/api/devconfig/muo/:muoId',
        '/api/devconfig/rto/:rtoId'
      ],
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Upgrades Versions Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  /*
  // If an version is being processed and the current user created it then allow any manipulation
  if (req.apcCommand && req.user && req.apcCommand.user && req.apcCommand.user.id === req.user.id) {
    return next();
  }
  */

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
