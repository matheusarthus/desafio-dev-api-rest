const { v4 } = require('uuid');
const { Sequelize, Model } = require('sequelize');

class Transaction extends Model {
  static init(sequelize) {
    super.init(
      {
        account_id: Sequelize.UUID,
        value: Sequelize.DECIMAL(10, 2),
        transaction_type_id: Sequelize.INTEGER,
        transfer_id: Sequelize.UUID,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async (transaction) => {
      transaction.id = v4();
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Account, { foreignKey: 'account_id', as: 'account' });
    this.belongsTo(models.TransactionTypes, {
      foreignKey: 'transaction_type_id',
      as: 'transactionType',
    });
    this.belongsTo(models.Transfer, {
      foreignKey: 'transfer_id',
      as: 'transfer',
    });
  }
}

module.exports = Transaction;
