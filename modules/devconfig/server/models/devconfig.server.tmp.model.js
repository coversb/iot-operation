'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * target temperature Schema
 */
var TmpCommandSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    default: '',
    trim: true,
    required: '命令名称不能为空'
  },
  notes: {
    type: String,
    default: ''
  },
  temperature: {
    type: String,
    default: '',
    trim: true,
    required: '空调目标温度不能为空'
  },
  humidity: {
    type: String,
    default: '',
    trim: true,
    required: '空调目标湿度不能为空'
  },
  switch: {
    type: Number,
    default: 0,
    trim: true,
    required: '空调目标温度开关不能为空'
  }
});

mongoose.model('TmpCommand', TmpCommandSchema);
