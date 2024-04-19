const { default: mongoose } = require('mongoose');
const orderSchema = require('../schema/order');

async function findAll() {
  const orderModel = mongoose.model('Order', orderSchema);
  return orderModel.find({}).select();
}

async function findByID(id) {
  const orderModel = mongoose.model('Order', orderSchema);
  return orderModel.findById(id);
}

async function create(order) {
  const orderModel = mongoose.model('Order', orderSchema);
  return orderModel.create(order);
}

async function update(id, order) {
  const orderModel = mongoose.model('Order', orderSchema);
  return orderModel.findOneAndUpdate({ _id: id }, order, { new: true });
}

async function remove(id) {
  const orderModel = mongoose.model('Order', orderSchema);
  return orderModel.findOneAndDelete({ _id: id });
}

module.exports = {
  findAll,
  findByID,
  create,
  update,
  remove,
};
