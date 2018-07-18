'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Air-conditioner Working Configuration Schema
 */
var AcwCommandSchema = new Schema({
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
    required: '模式不能为空'
  },
  pwrOnEventMask: {
    type: String,
    default: '',
    trim: true,
    required: '空调供电打开触发条件不能为空'
  },
  pwrOffEventMask: {
    type: String,
    default: '',
    trim: true,
    required: '空调供电关闭触发条件不能为空'
  },
  duration: {
    type: String,
    default: '',
    trim: true,
    required: '空调供电提前打开时间不能为空'
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
  }
});

mongoose.model('AcwCommand', AcwCommandSchema);
