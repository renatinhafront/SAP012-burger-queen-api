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

const {
  isValid,
} = require('../middleware/validator');

const ckeckId = param('id').exists().isInt({ min: 1 }).withMessage('ID inválido');

module.exports = (app, next) => {
  app.get('/products', requireAuth, getProducts);

  app.get('/products/:id', requireAuth, ckeckId, isValid, getProductById);

  app.post('/products', requireAdmin, createProduct);

  app.put('/products/:id', requireAdmin, ckeckId, isValid, updateProduct);

  app.delete('/products/:id', requireAdmin, ckeckId, isValid, deleteProduct);

  next();
};
