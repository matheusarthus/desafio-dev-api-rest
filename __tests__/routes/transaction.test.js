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
  let userTestIdFrom;
  let accountIdFrom;
  let userTestIdTo;
  let accountIdTo;

  beforeAll(async () => {
    app = generateMockApp(
      transactionRoutes({ controller: transactionController })
    );
    const userTestFrom = await UserModel.create({
      name: 'Teste1',
      cpf: '55555555555',
      birth_date: '1989-01-01 00:00:00.000+00',
      password: 'teste123',
    });

    userTestIdFrom = userTestFrom.id;

    const accountFrom = await AccountModel.create({
      user_id: userTestIdFrom,
      balance: '300.00',
      daily_withdraw_limit: '500.00',
      active_account: true,
      account_type_id: 1,
    });

    accountIdFrom = accountFrom.id;

    const userTestTo = await UserModel.create({
      name: 'Teste2',
      cpf: '22222222222',
      birth_date: '1989-01-01 00:00:00.000+00',
      password: 'teste123',
    });

    userTestIdTo = userTestTo.id;

    const accountTo = await AccountModel.create({
      user_id: userTestIdTo,
      balance: '300.00',
      daily_withdraw_limit: '500.00',
      active_account: true,
      account_type_id: 1,
    });

    accountIdTo = accountTo.id;

    auth.token = jwt.sign({ id: userTestIdFrom }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });
  });

  afterAll(async () => {
    await AccountModel.destroy({
      where: {
        id: accountIdFrom,
      },
    });

    await AccountModel.destroy({
      where: {
        id: accountIdTo,
      },
    });

    await UserModel.destroy({
      where: {
        id: userTestIdFrom,
      },
    });

    await UserModel.destroy({
      where: {
        id: userTestIdTo,
      },
    });
  });

  describe('Create a new deposit transaction', () => {
    it('should return a deposit transaction register', () =>
      request(app)
        .post(`/transactions/${accountIdFrom}/deposit`)
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
        .post(`/transactions/${accountIdFrom}/withdraw`)
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
        .post(`/transactions/${accountIdFrom}/withdraw`)
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
          fromAccountId: accountIdFrom,
          toAccountId: accountIdTo,
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
          fromAccountId: accountIdFrom,
          toAccountId: accountIdTo,
          value: '500.00',
        })
        .then((response) => {
          expect(response.statusCode).toBe(400);
        }));
  });

  describe('Get a statement', () => {
    it('should return a statement without filter', () =>
      request(app)
        .get(`/transactions/${accountIdFrom}/statement`)
        .auth(auth.token, { type: 'bearer' })
        .query({ filterType: '' })
        .send()
        .then((response) => {
          expect(response.statusCode).toBe(201);
          expect(response.body).toHaveProperty('account');
          expect(response.body).toHaveProperty('totalTransactions');
          expect(response.body).toHaveProperty('transactions');
        }));
  });
});
