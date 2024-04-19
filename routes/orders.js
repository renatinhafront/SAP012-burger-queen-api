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

module.exports = (app, next) => {
  app.get('/orders', requireAuth, getOrders);

  app.get('/orders/:orderId', requireAuth, getOrderById);

  app.post('/orders', requireAuth, createOrder);

  app.put('/orders/:orderId', requireAuth, updateOrder);

  app.delete('/orders/:orderId', requireAuth, removeOrder);

  next();
};
