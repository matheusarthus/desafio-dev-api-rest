module.exports = {
  up: async (queryInterface) =>
    queryInterface.bulkInsert('accounts', [
      {
        id: 'f44051b5-096a-45c4-9904-753da71cf71d',
        user_id: 'a4320b65-34f8-41ca-8220-aecce46ede77',
        balance: '300.00',
        daily_withdraw_limit: '500.00',
        active_account: true,
        account_type_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]),

  down: (queryInterface) => queryInterface.bulkDelete('accounts', null, {}),
};
