'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Air Conditioner Operation Schema
 */
var AcoCommandSchema = new Schema({
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
  pwrMode: {
    type: String,
    default: '',
    trim: true,
    required: '空调开关不能为空'
  },
  workMode: {
    type: String,
    default: '',
    trim: true,
    required: '空调模式不能为空'
  },
  wind: {
    type: String,
    default: '',
    trim: true,
    required: '空调风力不能为空'
  },
  interval: {
    type: String,
    default: '',
    trim: true,
    required: '自动控制模式开启时长不能为空'
  },
  duration: {
    type: String,
    default: '',
    trim: true,
    required: '自动控制模式开启间隔不能为空'
  },
  temperature: {
    type: String,
    default: '',
    trim: true,
    required: '空调温度不能为空'
  }
});

mongoose.model('AcoCommand', AcoCommandSchema);
