'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  ApcCommand = mongoose.model('ApcCommand'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create
 */
exports.create = function (req, res) {
  var apcCommand = new ApcCommand(req.body);
  apcCommand.user = req.user;

  apcCommand.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(apcCommand);
    }
  });
};

/**
 * Show current
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var apcCommand = req.apcCommand ? req.apcCommand.toJSON() : {};

  // Add a custom field to the version, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the version model.
  apcCommand.isCurrentUserOwner = !!(req.user && apcCommand.user && apcCommand.user._id.toString() === req.user._id.toString());

  res.json(apcCommand);
};

/**
 * Update
 */
exports.update = function (req, res) {
  var apcCommand = req.apcCommand;
  console.log(req.body);
  apcCommand.name = req.body.name;
  apcCommand.apn = req.body.apn;
  apcCommand.userName = req.body.userName;
  apcCommand.password = req.body.password;
  apcCommand.mainDNS = req.body.mainDNS;
  apcCommand.backupDNS = req.body.backupDNS;

  apcCommand.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(apcCommand);
    }
  });
};

/**
 * Delete
 */
exports.delete = function (req, res) {
  var apcCommand = req.apcCommand;

  apcCommand.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(apcCommand);
    }
  });
};

/**
 * List of versions
 */
exports.list = function (req, res) {
  // console.log(req.query);
  // console.log('List of versions');
  var nameReg = new RegExp(req.query.name, 'i');
  var pageNum = parseInt(req.query.pageNum, 10);
  var pageSize = parseInt(req.query.pageSize, 10);
  var totalCount = 0;
  ApcCommand.find(
    {
      $and: [
        { name: { $regex: nameReg } }
      ]
    }
  ).exec(function (err, apcCommand) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      totalCount = apcCommand.length;
    }
  });

  ApcCommand.find(
    {
      $and: [
        { name: { $regex: nameReg } }
      ]
    }
  ).skip((pageNum - 1) * pageSize).limit(pageSize).sort('-created').populate('user', 'displayName')
    .exec(function (err, apcCommand) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        var ret = {
          code: 'success',
          count: totalCount,
          data: apcCommand
        };
        res.json(ret);
      }
    });
};

/**
 * middleware
 */
exports.apcCommandByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'APC Command is invalid'
    });
  }

  ApcCommand.findById(id).populate('user', 'displayName').exec(function (err, apcCommand) {
    if (err) {
      return next(err);
    } else if (!apcCommand) {
      return res.status(404).send({
        message: 'No APC Command with that identifier has been found'
      });
    }
    req.apcCommand = apcCommand;
    next();
  });
};
