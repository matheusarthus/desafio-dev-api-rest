const { Sequelize, Model } = require('sequelize');

class AccountTypes extends Model {
  static init(sequelize) {
    super.init(
      {
        type: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

module.exports = AccountTypes;
