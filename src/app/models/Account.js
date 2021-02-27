const { v4 } = require('uuid');
const { Sequelize, Model } = require('sequelize');

class Account extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: Sequelize.UUID,
        balance: Sequelize.DECIMAL(10, 2),
        daily_withdraw_limit: Sequelize.DECIMAL(10, 2),
        active_account: Sequelize.BOOLEAN,
        account_type_id: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async (account) => {
      account.id = v4();
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.AccountTypes, {
      foreignKey: 'account_type_id',
      as: 'accountType',
    });
  }
}

module.exports = Account;
