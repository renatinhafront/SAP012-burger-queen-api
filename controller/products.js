const { productRepository } = require('../repository');

module.exports = {

  createProduct: async (req, resp) => {
    try {
      const newProduct = await productRepository.create(req.body);
      if (!newProduct) {
        return resp.status(400).json({ error: 'Falha ao adicionar o produto.' });
      }

      return resp.status(200).json(newProduct);
    } catch (error) {
      console.error(error);
      return resp.status(500).json({ error: 'Ocorreu um erro ao processar a requisição.' });
    }
  },

  getProducts: async (req, resp) => {
    try {
      const listaProdutos = await productRepository.findAll();
      return resp.status(200).json(listaProdutos);
    } catch (error) {
      console.error(error);
      return resp.status(500).json({ error: 'Ocorreu um erro ao processar a requisição.' });
    }
  },

  getProductById: async (req, resp) => {
    try {
      const { id } = req.params;
      // if (!id || typeof id !== 'number') {
      //   return resp.status(404).json({ error: 'ID inválido' });
      // }

      const product = await productRepository.findByID(id);
      if (!product) {
        return resp.status(404).json({ error: 'Produto não encontrado.' });
      }

      return resp.status(200).json(product);
    } catch (error) {
      console.error(error);
      return resp.status(500).json({ error: 'Ocorreu um erro ao processar a requisição.' });
    }
  },

  updateProduct: async (req, resp) => {
    try {
      const { id } = req.params;
      // if (!id || typeof id !== 'number') {
      //   return resp.status(400).json({ error: 'ID inválido' });
      // }

      const product = await productRepository.update(id, req.body);
      if (!product) {
        return resp.status(404).json({ error: 'Produto não encontrado.' });
      }

      return resp.status(200).json(product);
    } catch (error) {
      console.error(error);
      return resp.status(500).json({ error: 'Ocorreu um erro ao processar a requisição.' });
    }
  },

  deleteProduct: async (req, resp) => {
    try {
      const { id } = req.params;
      // if (!id || typeof id !== 'number') {
      //   return resp.status(400).json({ error: 'ID inválido' });
      // }

      const product = await productRepository.remove(id);
      if (!product) {
        return resp.status(404).json({ error: 'Produto não encontrado.' });
      }

      return resp.status(200).json({ message: 'Produto excluído com sucesso.' });
    } catch (error) {
      console.error(error);
      return resp.status(500).json({ error: 'Ocorreu um erro ao processar a requisição.' });
    }
  },
};
