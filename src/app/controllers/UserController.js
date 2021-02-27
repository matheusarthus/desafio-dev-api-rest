module.exports = (UserModel) => ({
  store: async (user) => {
    const userExists = await UserModel.findOne({ where: { cpf: user.cpf } });

    if (userExists) {
      throw new Error('User already exists.');
    }

    const newUser = await UserModel.create(user);

    return newUser;
  },
});
