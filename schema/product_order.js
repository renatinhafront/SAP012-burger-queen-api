const mongoose = require('mongoose');
const productSchema = require('./product');

const productOrderSchema = new mongoose.Schema({
  qty: {
    type: Number,
    required: true,
  },
  product: {
    type: productSchema,
    required: true,
  },
});

module.exports = productOrderSchema;
