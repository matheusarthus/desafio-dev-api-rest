const boom = require('boom');

module.exports = (UserModel) => ({
  store: async (user) => {
    const userExists = await UserModel.findOne({ where: { cpf: user.cpf } });

    if (userExists) {
      throw boom.badRequest('User already exists.');
    }

    const newUser = await UserModel.create(user);

    return newUser;
  },
});
