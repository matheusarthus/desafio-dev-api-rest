const boom = require('boom');

module.exports = (
  UserModel,
  TransactionModel,
  TransactionTypes,
  TransferModel
) => ({
  show: async (accountId) => {
    const account = await AccountModel.findByPk(accountId, {
      include: [
        {
          model: UserModel,
          as: 'user',
          attributes: ['id', 'name', 'cpf'],
        },
        {
          model: AccountTypesModel,
          as: 'accountType',
          attributes: ['type'],
        },
      ],
    });

    if (!account) {
      throw boom.badRequest('Account does not exist.');
    }

    return account;
  },
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
  update: async (data) => {
    const account = await AccountModel.findByPk(data.accountId);

    if (!account) {
      throw boom.badRequest('Account does not exist.');
    }

    await account.update(data);

    return account;
  },
});
