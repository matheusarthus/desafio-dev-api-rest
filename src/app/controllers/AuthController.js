const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');
const User = require('../models/User');

class AuthController {
  async store(req, res) {
    const { cpf, password } = req.body;

    const user = await User.findOne({
      where: { cpf },
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

module.exports = new AuthController();
