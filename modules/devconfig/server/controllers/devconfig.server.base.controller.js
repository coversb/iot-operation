'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

function BaseCommand(name) {
  var Modal = mongoose.model(name);
  var CommandName = name;

  this.create = create;
  this.read = read;
  this.update = update;
  this.delete = del;
  this.list = list;
  this.commandByID = commandByID;

  /**
   * Create
   */
  function create(req, res) {
    var cmd = new Modal(req.body);
    cmd.user = req.user;

    cmd.save(function (err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(cmd);
      }
    });
  };

  /**
   * Show current
   */
  function read(req, res) {
    // convert mongoose document to JSON
    var cmd = req.cmdData ? req.cmdData.toJSON() : {};

    // Add a custom field to the version, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the version model.
    cmd.isCurrentUserOwner = !!(req.user && cmd.user && cmd.user._id.toString() === req.user._id.toString());

    res.json(cmd);
  };

  /**
   * Update
   */
  function update(req, res) {
    var cmd = req.cmdData;

    cmd.name = req.body.name;

    cmd.save(function (err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(cmd);
      }
    });
  };

  /**
   * Delete
   */
  function del(req, res) {
    var cmd = req.cmdData;

    cmd.remove(function (err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(cmd);
      }
    });
  };

  /**
   * List of versions
   */
  function list(req, res) {
    // console.log(req.query);
    // console.log('List of versions');
    var nameReg = new RegExp(req.query.name, 'i');
    var pageNum = parseInt(req.query.pageNum, 10);
    var pageSize = parseInt(req.query.pageSize, 10);
    var totalCount = 0;
    Modal.find(
      {
        $and: [
          {name: {$regex: nameReg}}
        ]
      }
    ).exec(function (err, data) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        totalCount = data.length;
      }
    });

    Modal.find(
      {
        $and: [
          {name: {$regex: nameReg}}
        ]
      }
    ).skip((pageNum - 1) * pageSize).limit(pageSize).sort('-created').populate('user', 'displayName')
      .exec(function (err, data) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          var ret = {
            code: 'success',
            count: totalCount,
            data: data
          };
          res.json(ret);
        }
      });
  };

  /**
   * middleware
   */
  function commandByID(req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        message: CommandName + ' Command is invalid'
      });
    }

    Modal.findById(id).populate('user', 'displayName').exec(function (err, data) {
      if (err) {
        return next(err);
      } else if (!data) {
        return res.status(404).send({
          message: 'No ' + CommandName + ' Command with that identifier has been found'
        });
      }

      req.cmdData = data;
      next();
    });
  };
};

module.exports = BaseCommand;

