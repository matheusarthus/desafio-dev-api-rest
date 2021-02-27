const Sequelize = require('sequelize');

const User = require('../app/models/User');
const AccountTypes = require('../app/models/AccountTypes');
const Account = require('../app/models/Account');

const dataBaseConfig = require('../config/database');

const models = [User, AccountTypes, Account];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(dataBaseConfig);

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

module.exports = new Database();
