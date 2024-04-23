const { productRepository } = require('../../repository');

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../products');

jest.mock('../../repository/reposi_product.js', () => ({
  findAll: jest.fn(),
  findByID: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}));

let req = {};
const resp = {
  status: jest.fn(() => resp),
  json: jest.fn(),
};

describe('createProduct', () => {
  it('deve criar um produto com sucesso', async () => {
    const mockCreateProduct = {
      _id: 10,
      name: 'Ham and Cheese Sandwich',
      price: 1000,
      image: 'https://github.com/Laboratoria/bootcamp/tree/main/projects/04-burger-queen-api/resources/images/sandwich.jpg',
      type: 'Breakfast',
      dateEntry: '2022-03-05T18:14:10.000Z',
      category: 'Padaria',
    };

    productRepository.create.mockResolvedValueOnce(mockCreateProduct);

    req = {
      body: {
        name: 'Ham and Cheese Sandwich',
        price: 1000,
        image: 'https://github.com/Laboratoria/bootcamp/tree/main/projects/04-burger-queen-api/resources/images/sandwich.jpg',
        type: 'Breakfast',
        dateEntry: '2022-03-05T18:14:10.000Z',
        category: 'Padaria',
      },
    };

    await createProduct(req, resp);

    expect(resp.status).toHaveBeenCalledWith(200);
    expect(resp.json).toHaveBeenCalledWith(mockCreateProduct);
  });

  it('deve retornar erro 400 se o corpo da requisição estiver incorreto', async () => {
    productRepository.create.mockResolvedValueOnce(null);

    await createProduct(req, resp);
    expect(resp.status).toHaveBeenCalledWith(400);
    expect(resp.json).toHaveBeenCalledWith({ error: 'Falha ao adicionar o produto.' });
  });

  it('deve retornar um erro 500 se ocorrer um erro inesperado', async () => {
    productRepository.create.mockRejectedValueOnce(new Error('Ocorreu um erro ao processar a requisição.'));

    await createProduct(req, resp);
    expect(resp.status).toHaveBeenCalledWith(500);
    expect(resp.json).toHaveBeenCalledWith({ error: 'Ocorreu um erro ao processar a requisição.' });
  });
});

describe('getProducts', () => {
  it('Deve obter uma lista de produtos', async () => {
    const mockProducts = [
      {
        name: 'Ham and Cheese Sandwich',
        price: 1000,
        image: 'https://github.com/Laboratoria/bootcamp/tree/main/projects/04-burger-queen-api/resources/images/sandwich.jpg',
        type: 'Breakfast',
        dateEntry: '2022-03-05T18:14:10.000Z',
        category: 'Padaria',
        _id: 10,
      },
    ];

    productRepository.findAll.mockResolvedValueOnce(mockProducts);
    req = { query: {} };
    await getProducts(req, resp);
    expect(resp.status).toHaveBeenCalledWith(200);
    expect(resp.json).toHaveBeenCalledWith(mockProducts);
  });

  it('Retornar erro em caso de erro interno', async () => {
    productRepository.findAll.mockRejectedValueOnce(new Error('Ocorreu um erro ao processar a requisição.'));

    await getProducts(req, resp);
    expect(resp.status).toHaveBeenCalledWith(500);
    expect(resp.json).toHaveBeenCalledWith({ error: 'Ocorreu um erro ao processar a requisição.' });
  });
});

describe('getProductById', () => {
  it('Deve obter o produto pelo ID', async () => {
    const mockProductById = {
      name: 'Ham and Cheese Sandwich',
      price: 1000,
      image: 'https://github.com/Laboratoria/bootcamp/tree/main/projects/04-burger-queen-api/resources/images/sandwich.jpg',
      type: 'Breakfast',
      dateEntry: '2022-03-05T18:14:10.000Z',
      category: 'Padaria',
      _id: 10,
    };

    productRepository.findByID.mockResolvedValueOnce(mockProductById);

    req = {
      params: { id: 1 },
    };
    await getProductById(req, resp);
    expect(resp.status).toHaveBeenCalledWith(200);
    expect(resp.json).toHaveBeenCalledWith(mockProductById);
  });

  it('Deve retornar um erro 404 quando o produto não for encontrado', async () => {
    productRepository.findByID.mockResolvedValueOnce(null);
    req = {
      params: { id: 6 },
    };
    await getProductById(req, resp);
    expect(resp.status).toHaveBeenCalledWith(404);
    expect(resp.json).toHaveBeenCalledWith({ error: 'Produto não encontrado.' });
  });

  it('Retornar erro 500 em caso de erro interno', async () => {
    productRepository.findByID.mockRejectedValueOnce(new Error('Ocorreu um erro ao processar a requisição.'));
    req = {
      params: { id: 6 },
    };
    await getProductById(req, resp);
    expect(resp.status).toHaveBeenCalledWith(500);
    expect(resp.json).toHaveBeenCalledWith({ error: 'Ocorreu um erro ao processar a requisição.' });
  });
});

describe('updateProduct', () => {
  it('Deve retornar produto atualizado', async () => {
    const mockProductUpdated = {
      name: 'Ham and Cheese Sandwich',
      price: 1000,
      image: 'https://github.com/Laboratoria/bootcamp/tree/main/projects/04-burger-queen-api/resources/images/sandwich.jpg',
      type: 'Breakfast',
      dateEntry: '2022-03-05T18:14:10.000Z',
      category: 'Padaria',
      _id: 10,
    };

    productRepository.update.mockResolvedValueOnce(mockProductUpdated);

    req = {
      params: { id: 1 },
      body: { email: 'admin@localhost.com', role: 'admin', password: 'xxxx' },
    };

    await updateProduct(req, resp);

    expect(resp.status).toHaveBeenCalledWith(200);
    expect(resp.json).toHaveBeenCalledWith(mockProductUpdated);
  });

  it('Deve retornar erro 404 quando o pedido não for encontrado', async () => {
    productRepository.update.mockResolvedValueOnce(null);

    req = {
      params: { id: 6 },
      body: { email: 'admin@localhost.com', role: 'admin', password: 'xxxx' },
    };

    await updateProduct(req, resp);

    expect(resp.status).toHaveBeenCalledWith(404);
    expect(resp.json).toHaveBeenCalledWith({ error: 'Produto não encontrado.' });
  });

  it('Retornar erro 500 em caso de erro interno', async () => {
    const mockError = new Error('Error');
    productRepository.update.mockRejectedValueOnce(mockError);

    req = {
      body: { email: 'admin@localhost.com', role: 'admin', password: 'xxxx' },
    };

    await updateProduct(req, resp);

    expect(resp.status).toHaveBeenCalledWith(500);
    expect(resp.json).toHaveBeenCalledWith({ error: 'Ocorreu um erro ao processar a requisição.' });
  });
});

describe('deleteProduct', () => {
  it('Deve retornar 200 ao deletar o produto', async () => {
    const mockProduct = {
      name: 'Ham and Cheese Sandwich',
      price: 1000,
      image: 'https://github.com/Laboratoria/bootcamp/tree/main/projects/04-burger-queen-api/resources/images/sandwich.jpg',
      type: 'Breakfast',
      dateEntry: '2022-03-05T18:14:10.000Z',
      category: 'Padaria',
      _id: 10,
    };

    productRepository.remove.mockResolvedValueOnce(mockProduct);

    req = {
      params: { id: 10 },
    };

    await deleteProduct(req, resp);

    expect(resp.status).toHaveBeenCalledWith(200);
    expect(resp.json).toHaveBeenCalledWith({ message: 'Produto excluído com sucesso.' });
  });

  it('Deve retornar um erro 404 quando o produto não for encontrado', async () => {
    productRepository.remove.mockResolvedValueOnce(null);

    req = {
      params: { id: 6 },
    };

    await deleteProduct(req, resp);

    expect(resp.status).toHaveBeenCalledWith(404);
    expect(resp.json).toHaveBeenCalledWith({ error: 'Produto não encontrado.' });
  });

  it('Retornar erro 500 em caso de erro interno', async () => {
    const mockError = new Error('Error');
    productRepository.remove.mockRejectedValueOnce(mockError);

    req = {
      params: { id: 6 },
    };

    await deleteProduct(req, resp);

    expect(resp.status).toHaveBeenCalledWith(500);
    expect(resp.json).toHaveBeenCalledWith({ error: 'Ocorreu um erro ao processar a requisição.' });
  });
});
