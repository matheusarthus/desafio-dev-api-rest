const boom = require('boom');

module.exports = (UserModel) => ({
  store: async (user) => {
    const userExists = await UserModel.findOne({ where: { cpf: user.cpf } });

    if (userExists) {
      throw boom.badRequest('User already exists.');
    }

    const { id, name, cpf } = await UserModel.create(user);

    return { id, name, cpf };
  },
  update: async (data) => {
    const user = await UserModel.findByPk(data.userId);

    if (data.cpf && data.cpf !== user.cpf) {
      const userExists = await UserModel.findOne({ where: { cpf: data.cpf } });

      if (userExists) {
        throw boom.badRequest('User already exists.');
      }
    }

    if (data.oldPassword && !(await user.checkPassword(data.oldPassword))) {
      throw boom.unauthorized('Password dos not match.');
    }

    await user.update(data);

    return {
      id: user.id,
      name: user.name,
      cpf: user.cpf,
    };
  },
});
