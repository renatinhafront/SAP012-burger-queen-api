/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
});

module.exports = userSchema;
