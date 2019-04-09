const { User } = require('../models/user');
const _ = require('lodash');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log({ email, password });
  let user = await User.findOne({ email });
  if (!user) return res.status(400).send('User not found Invalid credentials');

  try {
    await user.checkPassword(password);
  } catch (error) {
    return res.status(400).send('invalid credentials');
  }
  const token = user.generateToken();
  user = _.pick(user, [
    '_id',
    'name',
    'email',
    'createdAt',
    'updatedAt',
    '__v',
  ]);
  res.header('x-auth-token', req.header('x-auth-token')).json({ token, user });
};
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  let user = await User.findOne({ email });
  if (user) return res.status(400).send('Email already registered.');

  user = new User({
    name,
    email,
    password,
  });

  await user.save();

  const token = user.generateToken();
  user = _.pick(user, [
    '_id',
    'name',
    'email',
    'createdAt',
    'updatedAt',
    '__v',
  ]);
  res.header('x-auth-token', token).json({
    token,
    user,
  });
};
