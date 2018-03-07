'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Upgrade = mongoose.model('Upgrade'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Upgrade
 */
exports.create = function (req, res) {
  var upgrade = new Upgrade(req.body);
  upgrade.user = req.user;

  upgrade.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(upgrade);
    }
  });
};

/**
 * Show the current Upgrade
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var upgrade = req.upgrade ? req.upgrade.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  upgrade.isCurrentUserOwner = req.user && upgrade.user && upgrade.user._id.toString() === req.user._id.toString();

  res.jsonp(upgrade);
};

/**
 * Update a Upgrade
 */
exports.update = function (req, res) {
  var upgrade = req.upgrade;

  upgrade = _.extend(upgrade, req.body);

  upgrade.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(upgrade);
    }
  });
};

/**
 * Delete an Upgrade
 */
exports.delete = function (req, res) {
  var upgrade = req.upgrade;

  upgrade.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(upgrade);
    }
  });
};

/**
 * List of Upgrades
 */
exports.list = function (req, res) {
  Upgrade.find().sort('-created').populate('user', 'displayName').exec(function (err, upgrades) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(upgrades);
    }
  });
};

/**
 * Upgrade middleware
 */
exports.upgradeByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Upgrade is invalid'
    });
  }

  Upgrade.findById(id).populate('user', 'displayName').exec(function (err, upgrade) {
    if (err) {
      return next(err);
    } else if (!upgrade) {
      return res.status(404).send({
        message: 'No Upgrade with that identifier has been found'
      });
    }
    req.upgrade = upgrade;
    next();
  });
};
