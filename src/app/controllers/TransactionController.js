const boom = require('boom');

module.exports = (
  connection,
  AccountModel,
  TransactionModel,
  TransactionTypes,
  TransferModel
) => ({
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
      throw err;
    }
  },
});
