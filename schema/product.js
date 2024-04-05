/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number, // para restringir as roles
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  dataEntry: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

module.exports = productSchema;
