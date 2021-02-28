const { Op } = require('sequelize');
const boom = require('boom');

module.exports = (
  connection,
  UserModel,
  AccountModel,
  TransactionModel,
  TransactionTypes,
  TransferModel
) => ({
  statement: async ({ accountId, startDate, endDate, filterType }) => {
    const account = await AccountModel.findOne({
      where: { id: accountId },
      include: [
        {
          model: UserModel,
          as: 'user',
          attributes: ['name', 'cpf'],
        },
      ],
    });

    if (!account) {
      throw boom.badRequest('Account does not exist.');
    }

    const filter = {
      account_id: accountId,
    };

    if (filterType === 'period') {
      filter.created_at = {
        [Op.between]: [startDate, endDate],
      };
    }

    const transactions = await TransactionModel.findAll({
      where: filter,
      order: ['created_at'],
      include: [
        {
          model: TransactionTypes,
          as: 'transactionType',
          attributes: ['type'],
        },
        {
          model: TransferModel,
          as: 'transfer',
          attributes: ['account_id_from', 'account_id_to'],
          include: [
            {
              model: AccountModel,
              as: 'account_from',
              attributes: ['id'],
              include: [
                {
                  model: UserModel,
                  as: 'user',
                  attributes: ['name', 'cpf'],
                },
              ],
            },
            {
              model: AccountModel,
              as: 'account_to',
              attributes: ['id'],
              include: [
                {
                  model: UserModel,
                  as: 'user',
                  attributes: ['name', 'cpf'],
                },
              ],
            },
          ],
        },
      ],
    });

    if (transactions && transactions.length <= 0) {
      throw boom.badRequest('There are not transactions for this period.');
    }

    return {
      account,
      period: { start: startDate.toString(), end: endDate.toString() },
      totalTransactions: transactions.length,
      transactions,
    };
  },
  deposit: async ({ accountId, value }) => {
    const account = await AccountModel.findByPk(accountId);

    if (!account) {
      throw boom.badRequest('Account does not exist.');
    }

    const newBalance = Number(account.balance) + Number(value);

    account.balance = newBalance;

    const t = await connection.transaction();

    try {
      await account.save({ transaction: t });

      const transaction = await TransactionModel.create(
        {
          account_id: account.id,
          value,
          transaction_type_id: 1,
        },
        { transaction: t }
      );

      await t.commit();

      return transaction;
    } catch (err) {
      await t.rollback();
      throw boom.internal(err);
    }
  },
  withdraw: async ({ accountId, value }) => {
    const account = await AccountModel.findByPk(accountId);

    if (!account) {
      throw boom.badRequest('Account does not exist.');
    }

    const newBalance = Number(account.balance) - Number(value);

    if (newBalance < 0) {
      throw boom.badRequest('Balance is not enough for this transaction.');
    }

    account.balance = newBalance;

    const t = await connection.transaction();

    try {
      await account.save({ transaction: t });

      const transaction = await TransactionModel.create(
        {
          account_id: account.id,
          value,
          transaction_type_id: 2,
        },
        { transaction: t }
      );

      await t.commit();

      return transaction;
    } catch (err) {
      await t.rollback();
      throw boom.internal(err);
    }
  },
  transfer: async ({ fromAccountId, toAccountId, value }) => {
    const fromAccount = await AccountModel.findByPk(fromAccountId);

    if (!fromAccount) {
      throw boom.badRequest('Account from withdraw does not exist.');
    }

    const toAccount = await AccountModel.findByPk(toAccountId);

    if (!toAccount) {
      throw boom.badRequest('Account from deposit does not exist.');
    }

    const newBalanceFromAccount = Number(fromAccount.balance) - Number(value);

    if (newBalanceFromAccount < 0) {
      throw boom.badRequest('Balance is not enough for this transaction.');
    }

    fromAccount.balance = newBalanceFromAccount;

    const newBalanceToAccount = Number(toAccount.balance) + Number(value);

    toAccount.balance = newBalanceToAccount;

    const t = await connection.transaction();

    try {
      await fromAccount.save({ transaction: t });

      await toAccount.save({ transaction: t });

      const transfer = await TransferModel.create(
        {
          account_id_from: fromAccount.id,
          account_id_to: toAccount.id,
        },
        { transaction: t }
      );

      const withdrawTransaction = await TransactionModel.create(
        {
          account_id: fromAccount.id,
          value,
          transaction_type_id: 3,
          transfer_id: transfer.id,
        },
        { transaction: t }
      );

      const depositTransaction = await TransactionModel.create(
        {
          account_id: toAccount.id,
          value,
          transaction_type_id: 3,
          transfer_id: transfer.id,
        },
        { transaction: t }
      );

      await t.commit();

      return { from: withdrawTransaction, to: depositTransaction };
    } catch (err) {
      await t.rollback();
      throw boom.internal(err);
    }
  },
});
