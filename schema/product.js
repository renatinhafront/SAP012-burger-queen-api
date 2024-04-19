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
  },
  type: {
    type: String,
    required: true,
  },
  dateEntry: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

module.exports = productSchema;
