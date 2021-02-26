const { uuid } = require('uuidv4');
const { Sequelize, Model } = require('sequelize');

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        cpf: Sequelize.STRING,
        birth_date: Sequelize.DATE,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async (user) => {
      user.id = uuid();
    });

    return this;
  }
}

module.exports = User;
