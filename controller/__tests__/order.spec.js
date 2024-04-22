const { orderRepository, productRepository } = require('../../repository');

const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  removeOrder,
} = require('../order');

jest.mock('../../repository', () => ({
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

describe('getOrders', () => {
  it('Deve obter uma lista de ordens', async () => {
    const mockOrders = [
      {
        _id: '6621abcd915edebb7e7216c4',
        userId: 15254,
        client: 'Carol Shaw',
        products: [
          {
            qty: 5,
            product: {
              id: 1214,
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
    orderRepository.findAll.mockResolvedValueOnce(null);

    await getOrders(req, resp);

    expect(resp.status).toHaveBeenCalledWith(500);
    expect(resp.json).toHaveBeenCalledWith({ error: 'Ocorreu um erro ao processar a requisição.' });
  });
});

describe('getOrderById', () => {
  it('Deve obter o usuário pelo ID', async () => {
    // eslint-disable-next-line operator-linebreak
    const mockUserId = {
      _id: '6619acbc13832c1f5a8f26eb',
      email: 'admin@localhost.com',
      role: 'admin',
      __v: 0,
    };

    orderRepository.findByID.mockResolvedValueOnce(mockUserId);

    const req = {
      params: { uid: '6619acbc13832c1f5a8f26eb' },
    };

    await getOrderById(req, resp);

    // Verificar se a resposta tem status 200
    expect(resp.status).toHaveBeenCalledWith(200);
    // Verificar se a resposta contém a lista de usuário
    expect(resp.json).toHaveBeenCalledWith(mockUserId);
  });

  it('Deve retornar um erro 404 quando o ID for inválido', async () => {
    const req = {
      params: { },
    };

    await getOrderById(req, resp);

    // Verificar se a resposta tem status 404
    expect(resp.status).toHaveBeenCalledWith(404);
    // Verificar se a resposta contém a mensagem de erro
    expect(resp.json).toHaveBeenCalledWith({ error: 'ID de usuário inválido' });
  });

  it('Deve retornar um erro 404 quando o usuário não for encontrado', async () => {
    orderRepository.findByID.mockResolvedValueOnce(null);

    req = {
      params: { uid: 'banana' },
    };

    await getOrderById(req, resp);

    expect(resp.status).toHaveBeenCalledWith(404);
    expect(resp.json).toHaveBeenCalledWith({ error: 'Usuário não encontrado.' });
  });

  it('Retornar erro em caso de erro interno', async () => {
    orderRepository.findByEmail.mockResolvedValueOnce(null);
    orderRepository.create.mockRejectedValueOnce(new Error('Erro interno no servidor'));

    req = {
      body: { email: 'admin@localhost.com', role: 'admin', password: 'xxxx' },
    };

    await createOrder(req, resp);

    expect(resp.status).toHaveBeenCalledWith(500);
    expect(resp.json).toHaveBeenCalledWith({ error: 'Ocorreu um erro ao processar a requisição.' });
  });
});

describe('createOrder', () => {
  it('deve criar um pedido com sucesso', async () => {
    await createOrder(req, resp);
    expect(orderRepository.create).toHaveBeenCalledWith(req.body);
    expect(productRepository.findByID).toHaveBeenCalledTimes(2);
    expect(productRepository.updateStock).toHaveBeenCalledTimes(2);
    expect(resp.status).toHaveBeenCalledWith(201);
    expect(resp.json).toHaveBeenCalledWith({ message: 'Pedido criado com sucesso.', order: { id: 'pedido123', ...req.body } });
  });

  it('deve retornar um erro 404 se algum produto não for encontrado', async () => {
    productRepository.findByID.mockImplementationOnce(() => null);
    await createOrder(req, resp);
    expect(resp.status).toHaveBeenCalledWith(404);
    expect(resp.json).toHaveBeenCalledWith({ error: `Produto ${orderRepository.product.id} não encontrado.` });
  });

  it('deve retornar um erro 500 se ocorrer um erro inesperado', async () => {
    orderRepository.create.mockRejectedValueOnce(new Error('Erro ao criar pedido'));
    await createOrder(req, resp);
    expect(resp.status).toHaveBeenCalledWith(500);
    expect(resp.json).toHaveBeenCalledWith({ error: 'Falha ao criar pedido.' });
  });
});

describe('updateOrder', () => {
  it('Deve retornar sucesso quando for alterado o user', async () => {
    const mockOrderUpdated = {
      _id: '6619acbc13832c1f5a8f26eb',
      email: 'admin2@localhost.com',
      role: 'admin',
      __v: 0,
    };

    orderRepository.update.mockResolvedValueOnce(mockOrderUpdated);

    req = {
      params: { uid: '6619acbc13832c1f5a8f26eb' },
      body: { email: 'admin2@localhost.com', role: 'admin', password: 'xxxx' },
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
    expect(resp.json).toHaveBeenCalledWith({ error: 'ID de usuário inválido' });
  });

  it('Deve retornar erro 404 quando o usuário não existe', async () => {
    orderRepository.update.mockResolvedValueOnce(null);

    req = {
      params: { uid: '6619acbc13832c1f5a8f26eb' },
      body: { email: 'admin2@localhost.com', role: 'admin', password: 'xxxx' },
    };

    await updateOrder(req, resp);

    expect(resp.status).toHaveBeenCalledWith(404);
    expect(resp.json).toHaveBeenCalledWith({ error: 'Pedido não encontrado.' });
  });

  it('Retornar erro em caso de erro interno', async () => {
    orderRepository.findByEmail.mockResolvedValueOnce(null);
    orderRepository.create.mockRejectedValueOnce(new Error('Erro interno no servidor'));

    req = {
      body: { email: 'admin@localhost.com', role: 'admin', password: 'xxxx' },
    };

    await createOrder(req, resp);

    expect(resp.status).toHaveBeenCalledWith(500);
    expect(resp.json).toHaveBeenCalledWith({ error: 'Ocorreu um erro ao processar a requisição.' });
  });
});

describe('removeOrder', () => {
  it('Deve retornar 200 ao deletar o order', async () => {
    const mockUserDelete = {
      _id: '6619acbc13832c1f5a8f26eb',
    };

    orderRepository.removeOrder.mockResolvedValueOnce(mockUserDelete);

    req = {
      params: { orderId: '619acbc13832c1f5a8f26eb' },
    };

    await removeOrder(req, resp);

    expect(resp.status).toHaveBeenCalledWith(200);
    expect(resp.json).toHaveBeenCalledWith(mockUserDelete);
  });

  it('Deve retornar um erro 400 quando o pedido o ID for inválido', async () => {
    req = {
      params: { },
    };

    await removeOrder(req, resp);

    expect(resp.status).toHaveBeenCalledWith(400);
    expect(resp.json).toHaveBeenCalledWith({ error: 'ID de pedido inválido' });
  });

  it('Deve retornar um erro 404 quando o pedido não for encontrado', async () => {
    orderRepository.remove.mockResolvedValueOnce(null);

    req = {
      params: { orderId: '619acbc13832c1f5a8f26eb' },
    };

    await removeOrder(req, resp);

    expect(resp.status).toHaveBeenCalledWith(404);
    expect(resp.json).toHaveBeenCalledWith({ error: 'Pedido não encontrado.' });
  });

  it('Retornar erro em caso de erro interno', async () => {
    orderRepository.findByID.mockResolvedValueOnce(null);
    req = {
      params: { orderId: '619acbc13832c1f5a8f26eb' },
    };

    await removeOrder(req, resp);

    expect(resp.status).toHaveBeenCalledWith(500);
    expect(resp.json).toHaveBeenCalledWith({ error: 'Ocorreu um erro ao processar a requisição.' });
  });
});
