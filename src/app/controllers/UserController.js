const User = require('../models/User');

class UserController {
  async store(req, res) {
    const userExists = await User.findOne({ where: { cpf: req.body.cpf } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const { id, name } = await User.create(req.body);

    return res.json({ id, name });
  }
}

module.exports = new UserController();
