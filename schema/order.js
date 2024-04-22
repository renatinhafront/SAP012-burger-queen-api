/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);
const productOrder = require('./product_order');

const orderSchema = new mongoose.Schema({
  _id: {
    type: Number,
  },
  userId: {
    type: Number,
    required: true,
  },
  client: {
    type: String,
    required: true,
  },
  products: {
    type: [productOrder],
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  dateEntry: {
    type: Date,
    required: true,
  },
  dateProcessed: {
    type: Date,
    required: true,
  },
}, { _id: false });

orderSchema.plugin(autoIncrement, {
  id: 'Order',
  inc_field: '_id',
  start_seq: 1,
});

module.exports = orderSchema;
