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
 * Server Configuration Schema
 */
var SerCommandSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  notes: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: '',
    trim: true,
    required: '命令名称不能为空'
  },
  mode: {
    type: String,
    default: '',
    trim: true,
    required: '上报模式不能为空'
  },
  mainServer: {
    type: String,
    default: '',
    trim: true,
    required: '主服务器域名不能为空'
  },
  mainPort: {
    type: String,
    default: '',
    trim: true,
    required: '主服务器端口号不能为空'
  },
  backupServer: {
    type: String,
    default: '',
    trim: true,
    required: '备份服务器域名不能为空'
  },
  backupPort: {
    type: String,
    default: '',
    trim: true,
    required: '备份服务器端口号不能为空'
  },
  sms: {
    type: String,
    default: '',
    trim: true,
    required: '短信报文接收中心号码不能为空'
  },
  hbpInterval: {
    type: String,
    default: '',
    trim: true,
    required: '心跳包间隔不能为空'
  },
  maxRandomTime: {
    type: String,
    default: '',
    trim: true,
    required: '重连睡眠时间不能为空'
  }
});

mongoose.model('SerCommand', SerCommandSchema);
