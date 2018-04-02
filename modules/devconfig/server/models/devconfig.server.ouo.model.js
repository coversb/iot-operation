'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Order Update Operation Schema
 */
var OuoCommandSchema = new Schema({
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
  orderNum: {
    type: String,
    default: '',
    trim: true,
    required: '订单数量不能为空'
  },
  type: {
    type: String,
    default: '',
    trim: true,
    required: '订单类型不能为空'
  },
  orderID: {
    type: String,
    default: '',
    trim: true,
    required: '订单ID不能为空'
  },
  orderStart: {
    type: String,
    default: '',
    trim: true,
    required: '订单开始时间不能为空'
  },
  orderExpire: {
    type: String,
    default: '',
    trim: true,
    required: '订单结束时间不能为空'
  },
  orderPassword: {
    type: String,
    default: '',
    trim: true,
    required: '订单密码不能为空'
  },
  orderPersonNumber: {
    type: String,
    default: '',
    trim: true,
    required: '订单人数不能为空'
  },
  orderPasswordValidConut: {
    type: String,
    default: '',
    trim: true,
    required: '订单密码有效次数不能为空'
  }
});

mongoose.model('OuoCommand', OuoCommandSchema);
