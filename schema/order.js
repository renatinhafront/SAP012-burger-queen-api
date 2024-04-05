/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
const productOrder = require('./product_order');

const orderSchema = new mongoose.Schema({
  id: {
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
  dataEntry: {
    type: Date,
    required: true,
  },
  dataProcessed: {
    type: Date,
    required: true,
  },
});

module.exports = orderSchema;
