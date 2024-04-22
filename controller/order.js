const { orderRepository, productRepository } = require('../repository');

module.exports = {
  getOrders: async (req, resp) => {
    try {
      const listaOrder = await orderRepository.findAll();
      return resp.status(200).json(listaOrder);
    } catch (error) {
      console.error(error);
      return resp.status(500).json({ error: 'Ocorreu um erro ao processar a requisição.' });
    }
  },

  getOrderById: async (req, resp) => {
    try {
      const { orderId } = req.params;
      if (!orderId || typeof orderId !== 'number') {
        return resp.status(404).json({ error: 'ID inválido' });
      }

      const order = await orderRepository.findByID(orderId);
      if (!order) {
        return resp.status(404).json({ error: 'Pedido não encontrado.' });
      }

      return resp.status(200).json(order);
    } catch (error) {
      console.error(error);
      return resp.status(500).json({ error: 'Ocorreu um erro ao processar a requisição.' });
    }
  },
  createOrder: async (req, resp) => {
    try {
      if (!req.body || !req.body.products || !Array.isArray(req.body.products)) {
        return resp.status(400).json({ error: 'Dados de entrada inválidos.' });
      }
      // Verifica se todos os produtos estão disponíveis
      // eslint-disable-next-line no-restricted-syntax
      for (const productOrder of req.body.products) {
        // eslint-disable-next-line no-await-in-loop
        const prod = await productRepository.findByID(productOrder.product.id);
        if (!prod) {
          console.info(`Produto ${productOrder.product.id} não encontrado.`);
          return resp.status(404).json({ error: `Produto ${productOrder.product.id} não encontrado.` });
        }
      }
      // Cria o pedido
      const order = await orderRepository.create(req.body);
      return resp.status(201).json(order);
    } catch (error) {
      console.error(error);
      return resp.status(500).json({ error: 'Ocorreu um erro ao processar a requisição.' });
    }
  },

  updateOrder: async (req, resp) => {
    try {
      const { orderId } = req.params;
      if (!orderId || typeof orderId !== 'number') {
        return resp.status(400).json({ error: 'ID inválido' });
      }

      const order = await orderRepository.update(orderId, req.body);
      if (!order) {
        return resp.status(404).json({ error: 'Pedido não encontrado.' });
      }

      return resp.status(200).json(order);
    } catch (error) {
      console.error(error);
      return resp.status(500).json({ error: 'Ocorreu um erro ao processar a requisição.' });
    }
  },

  removeOrder: async (req, resp) => {
    try {
      const { orderId } = req.params;
      if (!orderId || typeof orderId !== 'number') {
        return resp.status(400).json({ error: 'ID inválido' });
      }

      const order = await orderRepository.remove(orderId);
      if (!order) {
        return resp.status(404).json({ error: 'Pedido não encontrado.' });
      }

      return resp.status(200).json({ message: 'Pedido removido com sucesso.' });
    } catch (error) {
      console.error(error);
      return resp.status(500).json({ error: 'Ocorreu um erro ao processar a requisição.' });
    }
  },
};
