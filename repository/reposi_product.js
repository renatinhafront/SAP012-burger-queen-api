const { default: mongoose } = require('mongoose');
const productSchema = require('../schema/product');

async function findAll() {
  const productModel = mongoose.model('Product', productSchema);
  return productModel.find({});
}

async function findByID(id) {
  const productModel = mongoose.model('Product', productSchema);
  return productModel.findById({ _id: id });
}

async function create(product) {
  const productModel = mongoose.model('Product', productSchema);
  return productModel.create(product);
}

async function update(id, product) {
  const productModel = mongoose.model('Product', productSchema);
  return productModel.findOneAndUpdate({ _id: id }, product, { new: true });
}

async function remove(id) {
  const productModel = mongoose.model('Product', productSchema);
  return productModel.findOneAndDelete({ _id: id });
}

module.exports = {
  findAll,
  findByID,
  create,
  update,
  remove,
};
