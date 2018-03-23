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
 * Upgrade Version Schema
 */
var VersionSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    default: '',
    trim: true,
    required: '版本名称不能为空'
  },
  url: {
    type: String,
    default: '',
    trim: true,
    required: '固件URL不能为空'
  },
  md5: {
    type: String,
    default: '',
    trim: true,
    required: 'MD5不能为空'
  },
  devType: {
    type: String,
    default: '',
    trim: true,
    required: '硬件类型不能为空'
  },
  verNo: {
    type: String,
    default: '',
    trim: true,
    required: '版本号不能为空'
  },
  retry: {
    type: String,
    default: '',
    trim: true,
    required: '重试次数不能为空'
  },
  timeout: {
    type: String,
    default: '',
    trim: true,
    required: '升级超时不能为空'
  },
  protocol: {
    type: String,
    default: '',
    trim: true,
    required: '升级协议不能为空'
  },
  port: {
    type: String,
    default: '',
    trim: true,
    required: '服务器端口号不能为空'
  },
  userName: {
    type: String,
    default: '',
    trim: true,
    required: '服务器用户名不能为空'
  },
  password: {
    type: String,
    default: '',
    trim: true,
    required: '服务器密码不能为空'
  },
  key: {
    type: String,
    default: '',
    trim: true,
    required: 'KEY不能为空'
  },
  dwnAddr: {
    type: String,
    default: '',
    trim: true,
    required: '下载地址不能为空'
  },
  bootAddr: {
    type: String,
    default: '',
    trim: true,
    required: '启动地址不能为空'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

VersionSchema.statics.seed = seed;

mongoose.model('Version', VersionSchema);

/**
* Seeds the User collection with document (Version)
* and provided options.
*/
function seed(doc, options) {
  var Version = mongoose.model('Version');

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
        Version
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
            message: chalk.yellow('Database Seeding: Version\t' + doc.name + ' skipped')
          });
        }

        var version = new Version(doc);

        version.save(function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: Version\t' + version.name + ' added'
          });
        });
      });
    }
  });
}
