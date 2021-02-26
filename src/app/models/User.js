const { uuid } = require('uuidv4');
const bcrypt = require('bcryptjs');
const { Sequelize, Model } = require('sequelize');

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        cpf: Sequelize.STRING,
        birth_date: Sequelize.DATE,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async (user) => {
      user.id = uuid();
    });

    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

module.exports = User;
