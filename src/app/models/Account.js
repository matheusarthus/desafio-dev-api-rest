const { Sequelize, Model } = require('sequelize');

class Account extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: Sequelize.UUID,
        balance: Sequelize.DECIMAL(10, 2),
        daily_withdraw_limit: Sequelize.DECIMAL(10, 2),
        active_account: Sequelize.BOOLEAN,
        account_type: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.AccountTypes, {
      foreignKey: 'account_type_id',
      as: 'account_type',
    });
  }
}

module.exports = Account;