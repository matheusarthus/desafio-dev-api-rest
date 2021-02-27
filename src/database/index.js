const Sequelize = require('sequelize');

const log4js = require('log4js');

const User = require('../app/models/User');
const AccountTypes = require('../app/models/AccountTypes');
const Account = require('../app/models/Account');
const TransactionTypes = require('../app/models/TransactionTypes');
const Transaction = require('../app/models/Transaction');
const Transfer = require('../app/models/Transfer');

const dataBaseConfig = require('../config/database');

const models = [
  User,
  AccountTypes,
  Account,
  TransactionTypes,
  Transaction,
  Transfer,
];

const logger = log4js.getLogger('[Database]');
class Database {
  constructor() {
    this.init();
  }

  init() {
    logger.debug('Starting Database Connection');
    this.connection = new Sequelize(dataBaseConfig);

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

module.exports = new Database();
