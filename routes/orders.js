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

const checkOrderId = param('orderId').exists().toInt();

module.exports = (app, next) => {
  app.get('/orders', requireAuth, getOrders);

  app.get('/orders/:orderId', requireAuth, checkOrderId, getOrderById);

  app.post('/orders', requireAuth, createOrder);

  app.put('/orders/:orderId', requireAuth, checkOrderId, updateOrder);

  app.delete('/orders/:orderId', requireAuth, checkOrderId, removeOrder);

  next();
};
