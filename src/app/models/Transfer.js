const { v4 } = require('uuid');
const { Sequelize, Model } = require('sequelize');

class Transfer extends Model {
  static init(sequelize) {
    super.init(
      {
        account_id_from: Sequelize.UUID,
        account_id_to: Sequelize.UUID,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async (transfer) => {
      transfer.id = v4();
    });

    return this;
  }

  static associate(models) {
    this.hasOne(models.Account, {
      foreignKey: 'account_id_from',
      as: 'account_from',
    });
    this.hasOne(models.Account, {
      foreignKey: 'account_id_to',
      as: 'account_to',
    });
  }
}

module.exports = Transfer;
