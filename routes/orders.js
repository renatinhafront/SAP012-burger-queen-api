const { param } = require('express-validator');

const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  removeOrder,
} = require('../controller/order');

const {
  requireAuth,
} = require('../middleware/auth');

const {
  isValid,
} = require('../middleware/validator');

const ckeckId = param('id').exists().isInt({ min: 1 }).withMessage('ID inválido');

module.exports = (app, next) => {
  app.get('/orders', requireAuth, getOrders);

  app.get('/orders/:id', requireAuth, ckeckId, isValid, getOrderById);

  app.post('/orders', requireAuth, createOrder);

  app.put('/orders/:id', requireAuth, ckeckId, isValid, updateOrder);

  app.delete('/orders/:id', requireAuth, ckeckId, isValid, removeOrder);

  next();
};
