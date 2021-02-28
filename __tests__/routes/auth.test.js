const request = require('supertest');

require('../../src/config/auth');
require('../../src/database');

const { generateMockApp } = require('../../src/utils/mockapp');

const UserModel = require('../../src/app/models/User');

const authController = require('../../src/app/controllers/AuthController')(
  UserModel
);

const authRoutes = require('../../src/routes/auth');

describe('Auth routes', () => {
  let app;

  beforeAll(async () => {
    app = generateMockApp(authRoutes({ controller: authController }));
  });

  describe('Create a new session', () => {
    it('should return a new token', () =>
      request(app)
        .post('/auth')
        .send({
          name: 'João Alves',
          cpf: '99999999999',
          password: '123456',
        })
        .then((response) => {
          expect(response.statusCode).toBe(201);
          expect(response.body).toHaveProperty('token');
        }));
  });
});
