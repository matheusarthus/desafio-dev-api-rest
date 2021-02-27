const jwt = require('jsonwebtoken');
const boom = require('boom');
const authConfig = require('../../config/auth');

module.exports = (UserModel) => ({
  store: async ({ cpf, password }) => {
    const user = await UserModel.findOne({
      where: { cpf },
    });

    if (!user) {
      throw boom.badRequest('User not found');
    }

    if (!(await user.checkPassword(password))) {
      throw boom.badRequest('Password does not match');
    }

    const { id, name } = user;

    return {
      user: {
        id,
        name,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    };
  },
});
