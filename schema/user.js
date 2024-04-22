/* eslint-disable import/no-extraneous-dependencies */

const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = new mongoose.Schema({
  _id: {
    type: Number,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'waiter', 'chef'], // para restringir as roles
    required: true,
  },
}, { _id: false });

userSchema.plugin(autoIncrement, {
  id: 'User',
  inc_field: '_id',
  start_seq: 1,
});

module.exports = userSchema;
