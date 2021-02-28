const request = require('supertest');
const jwt = require('jsonwebtoken');

const authConfig = require('../../src/config/auth');

const database = require('../../src/database');

const { generateMockApp } = require('../../src/utils/mockapp');

const UserModel = require('../../src/app/models/User');
const AccountModel = require('../../src/app/models/Account');
const TransactionTypes = require('../../src/app/models/TransactionTypes');
const TransactionModel = require('../../src/app/models/Transaction');
const TransferModel = require('../../src/app/models/Transfer');

const transactionController = require('../../src/app/controllers/TransactionController')(
  database.connection,
  UserModel,
  AccountModel,
  TransactionModel,
  TransactionTypes,
  TransferModel
);

const transactionRoutes = require('../../src/routes/transaction');

describe('Transaction routes', () => {
  let app;
  const auth = {};
  const userId = 'a4320b65-34f8-41ca-8220-aecce46ede77'; // User Teste
  const userIdTo = 'f109c358-8d48-4a6e-8696-a4b9f6b424cd'; // User João Alves
  const accountId = 'f44051b5-096a-45c4-9904-753da71cf71d'; // User Teste`s Account

  beforeAll(() => {
    app = generateMockApp(
      transactionRoutes({ controller: transactionController })
    );

    auth.token = jwt.sign({ id: userId }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });
  });

  describe('Create a new deposit transaction', () => {
    it('should return a deposit transaction register', () =>
      request(app)
        .post(`/transactions/${accountId}/deposit`)
        .auth(auth.token, { type: 'bearer' })
        .send({
          value: '100.00',
        })
        .then((response) => {
          expect(response.statusCode).toBe(201);
          expect(response.body).toHaveProperty('id');
        }));
  });

  describe('Create a new withdram transaction', () => {
    it('should return a withdraw transaction register', () =>
      request(app)
        .post(`/transactions/${accountId}/withdraw`)
        .auth(auth.token, { type: 'bearer' })
        .send({
          value: '100.00',
        })
        .then((response) => {
          expect(response.statusCode).toBe(201);
          expect(response.body).toHaveProperty('id');
        }));

    it('should return an error if balance is not enough', () =>
      request(app)
        .post(`/transactions/${accountId}/withdraw`)
        .auth(auth.token, { type: 'bearer' })
        .send({
          value: '500.00',
        })
        .then((response) => {
          expect(response.statusCode).toBe(400);
        }));
  });

  describe('Create a new transfer transaction', () => {
    it('should return a transfer transaction register', () =>
      request(app)
        .post('/transactions/transfer')
        .auth(auth.token, { type: 'bearer' })
        .send({
          fromAccountId: userId,
          toAccountId: userIdTo,
          value: '100.00',
        })
        .then((response) => {
          expect(response.statusCode).toBe(201);
          expect(response.body.from).toHaveProperty('id');
          expect(response.body.to).toHaveProperty('id');
        }));

    it('should return an error if balance is not enough', () =>
      request(app)
        .post(`/transactions/transfer`)
        .auth(auth.token, { type: 'bearer' })
        .send({
          fromAccountId: userId,
          toAccountId: userIdTo,
          value: '500.00',
        })
        .then((response) => {
          expect(response.statusCode).toBe(400);
        }));
  });
});
