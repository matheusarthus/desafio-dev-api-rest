const userRoutes = require('./user');
const authRoutes = require('./auth');
const accountRoutes = require('./account');
const transactionRoutes = require('./transaction');

const authMiddleware = require('../app/middlewares/auth');

const database = require('../database');

const UserModel = require('../app/models/User');
const AccountModel = require('../app/models/Account');
const AccountTypesModel = require('../app/models/AccountTypes');
const TransactionTypes = require('../app/models/TransactionTypes');
const TransactionModel = require('../app/models/Transaction');
const TransferModel = require('../app/models/Transfer');

const userController = require('../app/controllers/UserController')(UserModel);
const authController = require('../app/controllers/AuthController')(UserModel);
const accountController = require('../app/controllers/AccountController')(
  UserModel,
  AccountModel,
  AccountTypesModel
);
const transactionController = require('../app/controllers/TransactionController')(
  database.connection,
  UserModel,
  AccountModel,
  TransactionModel,
  TransactionTypes,
  TransferModel
);

module.exports = (app) => {
  app.use('/', userRoutes({ controller: userController }));
  app.use('/', authRoutes({ controller: authController }));

  app.use(authMiddleware);

  app.use('/', accountRoutes({ controller: accountController }));
  app.use('/', transactionRoutes({ controller: transactionController }));
};
