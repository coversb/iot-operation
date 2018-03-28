'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  path = require('path'),
  config = require(path.resolve('./config/config')),
  chalk = require('chalk');

/**
 * Access Point Configuration Schema
 */
var ApcCommandSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    default: '',
    trim: true,
    required: '命令名称不能为空'
  },
  apn: {
    type: String,
    default: '',
    trim: true,
    required: '接入点名称不能为空'
  },
  userName: {
    type: String,
    default: '',
    trim: true,
    required: '接入点用户名不能为空'
  },
  password: {
    type: String,
    default: '',
    trim: true,
    required: '接入点密码不能为空'
  },
  mainDNS: {
    type: String,
    default: '',
    trim: true,
    required: '主DNS不能为空'
  },
  backupDNS: {
    type: String,
    default: '',
    trim: true,
    required: '备用DNS不能为空'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

ApcCommandSchema.statics.seed = seed;

mongoose.model('ApcCommand', ApcCommandSchema);

/**
* Seeds the User collection with document (apcCommand)
* and provided options.
*/
function seed(doc, options) {
  var ApcCommand = mongoose.model('ApcCommand');

  return new Promise(function (resolve, reject) {

    skipDocument()
      .then(findAdminUser)
      .then(add)
      .then(function (response) {
        return resolve(response);
      })
      .catch(function (err) {
        return reject(err);
      });

    function findAdminUser(skip) {
      var User = mongoose.model('User');

      return new Promise(function (resolve, reject) {
        if (skip) {
          return resolve(true);
        }

        User
          .findOne({
            roles: { $in: ['admin'] }
          })
          .exec(function (err, admin) {
            if (err) {
              return reject(err);
            }

            doc.user = admin;

            return resolve();
          });
      });
    }

    function skipDocument() {
      return new Promise(function (resolve, reject) {
        ApcCommand
          .findOne({
            name: doc.name
          })
          .exec(function (err, existing) {
            if (err) {
              return reject(err);
            }

            if (!existing) {
              return resolve(false);
            }

            if (existing && !options.overwrite) {
              return resolve(true);
            }

            // Remove (overwrite)

            existing.remove(function (err) {
              if (err) {
                return reject(err);
              }

              return resolve(false);
            });
          });
      });
    }

    function add(skip) {
      return new Promise(function (resolve, reject) {
        if (skip) {
          return resolve({
            message: chalk.yellow('Database Seeding: ApcCommand\t' + doc.name + ' skipped')
          });
        }

        var apcCommand = new ApcCommand(doc);

        apcCommand.save(function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: apc Command\t' + apcCommand.name + ' added'
          });
        });
      });
    }
  });
}
