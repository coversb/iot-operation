'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Watchdog Schema
 */
var DogCommandSchema = new Schema({
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
  sw: {
    type: String,
    default: '',
    trim: true,
    required: '模式开关不能为空'
  },
  report: {
    type: String,
    default: '',
    trim: true,
    required: '看门狗报文开关不能为空'
  },
  interval: {
    type: String,
    default: '',
    trim: true,
    required: '重启间隔不能为空'
  },
  rebootHour: {
    type: String,
    default: '',
    trim: true,
    required: '重启时刻小时不能为空'
  },
  rebootMinute: {
    type: String,
    default: '',
    trim: true,
    required: '重启时刻分钟不能为空'
  },
  randomTime: {
    type: String,
    default: '',
    trim: true,
    required: '随机时间不能为空'
  }
});

mongoose.model('DogCommand', DogCommandSchema);
