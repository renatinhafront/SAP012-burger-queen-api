/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const productSchema = new mongoose.Schema({
  _id: {
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
  },
  category: {
    type: String,
    required: true,
  },
}, { _id: false });

productSchema.pre('save', (next) => {
  this.dateEntry = Date.now();
  console.info(`Product saved ${Date.now()}`);
  next();
});

productSchema.plugin(autoIncrement, {
  id: 'Product',
  inc_field: '_id',
  start_seq: 1,
});

module.exports = productSchema;
