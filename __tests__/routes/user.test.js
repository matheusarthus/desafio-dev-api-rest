const request = require('supertest');
const jwt = require('jsonwebtoken');

const authConfig = require('../../src/config/auth');

require('../../src/database');

const { generateMockApp } = require('../../src/utils/mockapp');

const UserModel = require('../../src/app/models/User');

const userController = require('../../src/app/controllers/UserController')(
  UserModel
);

const userRoutes = require('../../src/routes/user');

describe('User routes', () => {
  let app;
  const auth = {};
  let userId; // User João Alves

  beforeAll(async () => {
    app = generateMockApp(userRoutes({ controller: userController }));

    const user = await UserModel.findOne({ where: { cpf: '99999999999' } });

    userId = user.id;

    auth.token = jwt.sign({ id: userId }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });
  });

  describe('Create a new user', () => {
    it('should return a new user', () =>
      request(app)
        .post('/users')
        .send({
          name: 'Raphaella Campos',
          cpf: '11111111111',
          birth_date: '1998-04-01 00:00:00.000+00',
          password: '123456',
        })
        .then((response) => {
          expect(response.statusCode).toBe(201);
          expect(response.body).toHaveProperty('id');
        }));

    it('should return a error with status code 400 if user already exists.', () =>
      request(app)
        .post('/users')
        .send({
          name: 'João Alves',
          cpf: '99999999999',
          birth_date: '1998-04-01 00:00:00.000+00',
          password: '123456',
        })
        .then((response) => {
          expect(response.statusCode).toBe(400);
        }));
  });

  describe('Update an user', () => {
    it('should return an updated field', () =>
      request(app)
        .put('/users')
        .auth(auth.token, { type: 'bearer' })
        .send({
          name: 'João Alves Souza',
          cpf: '22222222222',
        })
        .then((response) => {
          expect(response.statusCode).toBe(201);
          expect(response.body.name).toBe('João Alves Souza');
          expect(response.body.cpf).toBe('22222222222');
        }));
  });
});
