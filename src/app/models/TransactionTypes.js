const { Sequelize, Model } = require('sequelize');

class TransactionTypes extends Model {
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

module.exports = TransactionTypes;
