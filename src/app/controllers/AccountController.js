const boom = require('boom');

module.exports = (UserModel, AccountModel) => ({
  store: async (data) => {
    const userExists = await UserModel.findByPk(data.user_id, {
      include: [
        {
          model: AccountModel,
          as: 'account',
        },
      ],
    });

    if (!userExists) {
      throw boom.badRequest('User does not exist.');
    }

    if (userExists.account) {
      throw boom.badRequest('User has already an account.');
    }

    const account = await AccountModel.create(data);

    return account;
  },
  /* update: async (data) => {
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
  }, */
});
