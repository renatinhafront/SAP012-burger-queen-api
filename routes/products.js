const { param } = require('express-validator');

const {
  requireAuth,
  requireAdmin,
} = require('../middleware/auth');

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controller/products');

const checkProductId = param('productId').exists().toInt();

module.exports = (app, next) => {
  app.get('/products', requireAuth, getProducts);

  app.get('/products/:productId', requireAuth, checkProductId, getProductById);

  app.post('/products', requireAdmin, createProduct);

  app.put('/products/:productId', requireAdmin, checkProductId, updateProduct);

  app.delete('/products/:productId', requireAdmin, checkProductId, deleteProduct);

  next();
};
