'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
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

mongoose.model('ApcCommand', ApcCommandSchema);
