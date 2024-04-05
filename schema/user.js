/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: String,
    enum: ['admin', 'user'], // para restringir as roles
    required: true,
  },
  id: {
    type: Number,
  },
});

module.exports = userSchema;
