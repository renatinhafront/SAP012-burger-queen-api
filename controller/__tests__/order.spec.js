const { orderRepository, productRepository } = require('../../repository');

const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  removeOrder,
} = require('../order');

jest.mock('../../repository/reposi_product.js', () => ({
  findAll: jest.fn(),
  findByID: jest.fn(),
}));

jest.mock('../../repository/reposi_order.js', () => ({
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

describe('createOrder', () => {
  it('deve criar um pedido com sucesso', async () => {
    const mockCreateOrders = [
      {
        userId: 15254,
        client: 'Carol Shaw',
        products: [
          {
            qty: 5,
            product: {
              name: 'Ham and Cheese Sandwich',
              price: 1000,
              image: 'https://github.com/Laboratoria/bootcamp/tree/main/projects/04-burger-queen-api/resources/images/sandwich.jpg',
              type: 'Breakfast',
              dateEntry: '2022-03-05T18:14:10.000Z',
              category: 'Padaria',
              _id: 10,
            },
            _id: 5,
          },
        ],
        status: 'pending',
        dateEntry: '2022-03-05T18:14:10.000Z',
        dateProcessed: '2022-03-05T18:14:10.000Z',
        _id: 7,
        __v: 0,
      },
    ];

    productRepository.findByID.mockResolvedValueOnce({ mockCreateOrders });
    orderRepository.create.mockResolvedValueOnce(mockCreateOrders);

    req = {
      body: {
        userId: 15254,
        client: 'Carol Shaw',
        products: [
          {
            qty: 5,
            product: {
              id: 10,
            },
          },
        ],
      },
    };

    await createOrder(req, resp);

    expect(resp.status).toHaveBeenCalledWith(201);
    expect(resp.json).toHaveBeenCalledWith(mockCreateOrders);
  });

  it('deve retornar dados de entrada invalídos quando body vazio', async () => {
    // eslint-disable-next-line no-unused-expressions
    req = {
      body: {},
    };
    await createOrder(req, resp);
    expect(resp.status).toHaveBeenCalledWith(400);
    expect(resp.json).toHaveBeenCalledWith({ error: 'Dados de entrada inválidos.' });
  });
  it('deve retornar dados de entrada invalídos quando body.prodcuts vazio', async () => {
    req = {
      body: {
        userId: 15254,
        client: 'Carol Shaw',
      },
    };
    await createOrder(req, resp);
    expect(resp.status).toHaveBeenCalledWith(400);
    expect(resp.json).toHaveBeenCalledWith({ error: 'Dados de entrada inválidos.' });
  });

  it('deve retornar dados de entrada invalídos quando body.prodcuts vazio', async () => {
    req = {
      body: {
        userId: 15254,
        client: 'Carol Shaw',
        products: {},
      },
    };
    await createOrder(req, resp);
    expect(resp.status).toHaveBeenCalledWith(400);
    expect(resp.json).toHaveBeenCalledWith({ error: 'Dados de entrada inválidos.' });
  });

  it('deve retornar um erro 404 se o pedido não for encontrado', async () => {
    orderRepository.findByID.mockImplementationOnce(() => null);

    req = {
      body: {
        userId: 15254,
        client: 'Carol Shaw',
        products: [
          {
            qty: 5,
            product: {
              id: 10,
            },
          },
        ],
      },
    };
    await createOrder(req, resp);
    expect(resp.status).toHaveBeenCalledWith(404);
    expect(resp.json).toHaveBeenCalledWith({ error: `Produto ${10} não encontrado.` });
  });

  it('deve retornar um erro 500 se ocorrer um erro inesperado', async () => {
    productRepository.findByID.mockRejectedValueOnce(new Error('Ocorreu um erro ao processar a requisição.'));
    orderRepository.create.mockRejectedValueOnce(new Error('Ocorreu um erro ao processar a requisição.'));

    // eslint-disable-next-line no-unused-expressions
    req = {
      body: {
        userId: 15254,
        client: 'Carol Shaw',
        products: [
          {
            qty: 5,
            product: {
              id: 10,
            },
          },
        ],
      },
    },

    await createOrder(req, resp);
    expect(resp.status).toHaveBeenCalledWith(500);
    expect(resp.json).toHaveBeenCalledWith({ error: 'Ocorreu um erro ao processar a requisição.' });
  });
});
describe('getOrders', () => {
  it('Deve obter uma lista de ordens', async () => {
    const mockOrders = [
      {
        userId: 15254,
        client: 'Carol Shaw',
        products: [
          {
            qty: 5,
            product: {
              name: 'Ham and Cheese Sandwich',
              price: 1000,
              image: 'https://github.com/Laboratoria/bootcamp/tree/main/projects/04-burger-queen-api/resources/images/sandwich.jpg',
              type: 'Breakfast',
              dateEntry: '2022-03-05T18:14:10.000Z',
              category: 'Padaria',
              _id: '6621abcd915edebb7e7216c6',
            },
            _id: '6621abcd915edebb7e7216c5',
          },
        ],
        status: 'pending',
        dateEntry: '2022-03-05T18:14:10.000Z',
        dateProcessed: '2022-03-05T18:14:10.000Z',
        _id: 7,
        __v: 0,
      },

    ];

    orderRepository.findAll.mockResolvedValueOnce(mockOrders);

    await getOrders(req, resp);

    // Verificar se a resposta tem status 200
    expect(resp.status).toHaveBeenCalledWith(200);
    // Verificar se a resposta contém a lista de usuários
    expect(resp.json).toHaveBeenCalledWith(mockOrders);
  });

  it('Retornar erro em caso de erro interno', async () => {
    orderRepository.findAll.mockRejectedValueOnce(new Error('Ocorreu um erro ao processar a requisição.'));

    await getOrders(req, resp);

    expect(resp.status).toHaveBeenCalledWith(500);
    expect(resp.json).toHaveBeenCalledWith({ error: 'Ocorreu um erro ao processar a requisição.' });
  });
});

describe('getOrderById', () => {
  it('Deve obter o usuário pelo ID', async () => {
    const mockOrderById = {
      userId: 15254,
      client: 'Carol Shaw',
      products: [
        {
          qty: 5,
          product: {
            name: 'Ham and Cheese Sandwich',
            price: 1000,
            image: 'https://github.com/Laboratoria/bootcamp/tree/main/projects/04-burger-queen-api/resources/images/sandwich.jpg',
            type: 'Breakfast',
            dateEntry: '2022-03-05T18:14:10.000Z',
            category: 'Padaria',
            _id: 6,
          },
          _id: 6,
        },
      ],
      status: 'pending',
      dateEntry: '2022-03-05T18:14:10.000Z',
      dateProcessed: '2022-03-05T18:14:10.000Z',
      _id: 7,
      __v: 0,
    };

    orderRepository.findByID.mockResolvedValueOnce(mockOrderById);

    const req = {
      params: { orderId: 7 },
    };

    await getOrderById(req, resp);

    // Verificar se a resposta tem status 200
    expect(resp.status).toHaveBeenCalledWith(200);
    expect(resp.json).toHaveBeenCalledWith(mockOrderById);
  });

  it('Deve retornar um erro 404 quando o ID for inválido', async () => {
    const req = {
      params: { },
    };

    await getOrderById(req, resp);

    // Verificar se a resposta tem status 404
    expect(resp.status).toHaveBeenCalledWith(404);
    expect(resp.json).toHaveBeenCalledWith({ error: 'ID inválido' });
  });

  it('Deve retornar um erro 404 quando o pedido não for encontrado', async () => {
    orderRepository.findByID.mockResolvedValueOnce(null);

    req = {
      params: { orderId: 7 },
    };

    await getOrderById(req, resp);

    expect(resp.status).toHaveBeenCalledWith(404);
    expect(resp.json).toHaveBeenCalledWith({ error: 'Pedido não encontrado.' });
  });

  it('Retornar erro 500 em caso de erro interno', async () => {
    const mockError = new Error('Error');
    orderRepository.findByID.mockRejectedValueOnce(mockError);

    await getOrderById(req, resp);

    expect(resp.status).toHaveBeenCalledWith(500);
    expect(resp.json).toHaveBeenCalledWith({ error: 'Ocorreu um erro ao processar a requisição.' });
  });
});

describe('updateOrder', () => {
  it('Deve retornar sucesso quando for alterado o user', async () => {
    const mockOrderUpdated = {
      _id: 6,
      email: 'admin2@localhost.com',
      role: 'admin',
      __v: 0,
    };

    orderRepository.update.mockResolvedValueOnce(mockOrderUpdated);

    req = {
      params: { orderId: 6 },
    };

    await updateOrder(req, resp);

    expect(resp.status).toHaveBeenCalledWith(200);
    expect(resp.json).toHaveBeenCalledWith(mockOrderUpdated);
  });

  it('Deve retornar erro 400 quando o ID é inválido', async () => {
    req = {
      params: { },
    };

    await updateOrder(req, resp);

    expect(resp.status).toHaveBeenCalledWith(400);
    expect(resp.json).toHaveBeenCalledWith({ error: 'ID inválido' });
  });

  it('Deve retornar erro 404 quando o usuário não existe', async () => {
    orderRepository.update.mockResolvedValueOnce(null);

    req = {
      params: { orderId: 6 },
      body: { email: 'admin2@localhost.com', role: 'admin', password: 'xxxx' },
    };

    await updateOrder(req, resp);

    expect(resp.status).toHaveBeenCalledWith(404);
    expect(resp.json).toHaveBeenCalledWith({ error: 'Pedido não encontrado.' });
  });

  it('Retornar erro 500 em caso de erro interno', async () => {
    const mockError = new Error('Error');
    orderRepository.update.mockRejectedValueOnce(mockError);

    req = {
      body: { email: 'admin@localhost.com', role: 'admin', password: 'xxxx' },
    };

    await updateOrder(req, resp);

    expect(resp.status).toHaveBeenCalledWith(500);
    expect(resp.json).toHaveBeenCalledWith({ error: 'Ocorreu um erro ao processar a requisição.' });
  });
});

describe('removeOrder', () => {
  it('Deve retornar 200 ao deletar o order', async () => {
    orderRepository.remove.mockResolvedValueOnce({ message: 'Pedido removido com sucesso.' });

    req = {
      params: { orderId: 6 },
    };

    await removeOrder(req, resp);

    expect(resp.status).toHaveBeenCalledWith(200);
    expect(resp.json).toHaveBeenCalledWith({ message: 'Pedido removido com sucesso.' });
  });

  it('Deve retornar um erro 400 quando o ID for inválido', async () => {
    req = {
      params: { },
    };

    await removeOrder(req, resp);

    expect(resp.status).toHaveBeenCalledWith(400);
    expect(resp.json).toHaveBeenCalledWith({ error: 'ID inválido' });
  });

  it('Deve retornar um erro 404 quando o pedido não for encontrado', async () => {
    orderRepository.remove.mockResolvedValueOnce(null);

    req = {
      params: { orderId: 6 },
    };

    await removeOrder(req, resp);

    expect(resp.status).toHaveBeenCalledWith(404);
    expect(resp.json).toHaveBeenCalledWith({ error: 'Pedido não encontrado.' });
  });

  it('Retornar erro 500 em caso de erro interno', async () => {
    orderRepository.remove.mockRejectedValueOnce(new Error('Ocorreu um erro ao processar a requisição.'));

    req = {
      params: { orderId: 6 },
    };

    await removeOrder(req, resp);

    expect(resp.status).toHaveBeenCalledWith(500);
    expect(resp.json).toHaveBeenCalledWith({ error: 'Ocorreu um erro ao processar a requisição.' });
  });
});
