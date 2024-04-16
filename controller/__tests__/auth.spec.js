const bcrypt = require('bcrypt');
const { userRepository } = require('../../repository');

const {
  login,
} = require('../auth');

jest.mock('../../repository/reposi_user.js', () => ({
  findByEmail: jest.fn(),
}));

let req = {};
const resp = {
  status: jest.fn(() => resp),
  json: jest.fn(),
};

describe('login', () => {
  it('Deve retornar suscesso', async () => {
    const mockUserLogin = {
      _id: '6619acbc13832c1f5a8f26bb',
      email: 'admin@localhost.com',
      password: `${bcrypt.hashSync('changeme', 10)}`,
    };

    userRepository.findByEmail.mockResolvedValueOnce(mockUserLogin);

    req = {
      body: { email: 'admin@localhost.com', password: 'changeme' },
    };

    await login(req, resp);

    expect(resp.status).toHaveBeenCalledWith(200);
    expect(resp.json).toHaveBeenCalledWith({ auth: true, token: expect.any(String) });
  });

  it('Deve retornar erro 400 em caso de email ou senha não informado', async () => {
    req = {
      body: { email: 'admin@localhost.com' },
    };

    await login(req, resp);

    expect(resp.status).toHaveBeenCalledWith(400);
    expect(resp.json).toHaveBeenCalledWith({ error: 'Email ou senha não informado' });
  });

  it('Deve retornar erro 400 em caso de email inválido', async () => {
    req = {
      body: { email: 'adminlocalhost.com', password: 'changeme' },
    };

    await login(req, resp);

    expect(resp.status).toHaveBeenCalledWith(400);
    expect(resp.json).toHaveBeenCalledWith({ error: 'Email inválido' });
  });

  it('Deve retornar erro 404 em caso de email inexistente', async () => {
    userRepository.findByEmail.mockResolvedValueOnce(null);

    req = {
      body: { email: 'admin@localhost.com', password: 'changeme' },
    };

    await login(req, resp);

    expect(resp.status).toHaveBeenCalledWith(404);
    expect(resp.json).toHaveBeenCalledWith({ error: 'Usuário não encontrado.' });
  });

  it('Deve retornar erro 403 em caso de senha incorreta', async () => {
    const mockUserLogin = {
      _id: '6619acbc13832c1f5a8f26bb',
      email: 'ad@localhost.com',
      password: `${bcrypt.hashSync('changeme', 10)}`,
    };

    userRepository.findByEmail.mockResolvedValueOnce(mockUserLogin);

    req = {
      body: { email: 'admin@localhost.com', role: 'admin', password: 'xxxx' },
    };

    await login(req, resp);

    expect(resp.status).toHaveBeenCalledWith(403);
    expect(resp.json).toHaveBeenCalledWith({ error: 'Senha incorreta.' });
  });
});
