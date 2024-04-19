/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
const productOrder = require('./product_order');

const orderSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  seq: {
    type: Number,
    default: 0,
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
});

module.exports = orderSchema;
