'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Output Mode Configuration Schema
 */
var OmcCommandSchema = new Schema({
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
  idleOutput: {
    type: String,
    default: '',
    trim: true,
    required: '非服务时段输出不能为空'
  },
  inserviceOutput: {
    type: String,
    default: '',
    trim: true,
    required: '服务时段输出不能为空'
  },
  mode: {
    type: String,
    default: '',
    trim: true,
    required: '模式不能为空'
  },
  beginHour: {
    type: String,
    default: '',
    trim: true,
    required: '特定时段起始小时不能为空'
  },
  beginMinute: {
    type: String,
    default: '',
    trim: true,
    required: '特定时段起始分钟不能为空'
  },
  endHour: {
    type: String,
    default: '',
    trim: true,
    required: '特定时段结束小时不能为空'
  },
  endMinute: {
    type: String,
    default: '',
    trim: true,
    required: '特定时段结束分钟不能为空'
  },
  validIdleOutput: {
    type: String,
    default: '',
    trim: true,
    required: '特定时段非服务时段输出不能为空'
  },
  validInserviceOutput: {
    type: String,
    default: '',
    trim: true,
    required: '特定时段服务时段输出不能为空'
  }
});

mongoose.model('OmcCommand', OmcCommandSchema);
