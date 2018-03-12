'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Version = mongoose.model('Version'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an Version
 */
exports.create = function (req, res) {
  var version = new Version(req.body);
  version.user = req.user;

  version.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(version);
    }
  });
};

/**
 * Show the current version
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var version = req.version ? req.version.toJSON() : {};

  // Add a custom field to the version, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the version model.
  version.isCurrentUserOwner = !!(req.user && version.user && version.user._id.toString() === req.user._id.toString());

  res.json(version);
};

/**
 * Update an version
 */
exports.update = function (req, res) {
  var version = req.version;

  version.name = req.body.name;
  version.devType = req.body.devType;
  version.verNo = req.body.verNo;
  version.url = req.body.url;
  version.md5 = req.body.md5;

  version.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(version);
    }
  });
};

/**
 * Delete an version
 */
exports.delete = function (req, res) {
  var version = req.version;

  version.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(version);
    }
  });
};

/**
 * List of versions
 */
exports.list = function (req, res) {
  console.log(req.query);
  console.log('List of versions');
  var devTypeReg = new RegExp(req.query.devType, 'i');
  var verNoReg = new RegExp(req.query.verNo, 'i');
  var pageNum = parseInt(req.query.pageNum, 10);
  var pageSize = parseInt(req.query.pageSize, 10);
  var totalCount = 0;
  Version.find(
    {
      $and: [
        {devType: {$regex: devTypeReg}},
        {verNo: {$regex: verNoReg}}
      ]
    }
  ).exec(function (err, version) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      totalCount = version.length;
    }
  });

  Version.find(
    {
      $and: [
        {devType: {$regex: devTypeReg}},
        {verNo: {$regex: verNoReg}}
      ]
    }
  )
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize)
    .sort('-created').populate('user', 'displayName').exec(function (err, version) {

    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var ret = {
        code: 'success',
        count: totalCount,
        data: version
      };
      res.json(ret);
    }
  });
};

/**
 * version middleware
 */
exports.versionByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Version is invalid'
    });
  }

  Version.findById(id).populate('user', 'displayName').exec(function (err, version) {
    if (err) {
      return next(err);
    } else if (!version) {
      return res.status(404).send({
        message: 'No version with that identifier has been found'
      });
    }
    req.version = version;
    next();
  });
};
