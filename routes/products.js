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

module.exports = (app, next) => {
  app.get('/products', requireAuth, getProducts);

  app.get('/products/:productId', requireAuth, getProductById);

  app.post('/products', requireAdmin, createProduct);

  app.put('/products/:productId', requireAdmin, updateProduct);

  app.delete('/products/:productId', requireAdmin, deleteProduct);

  next();
};
