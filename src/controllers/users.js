const { User } = require('../models/user');
const _ = require('lodash');

exports.me = async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id).select('-password');
  res.header('x-auth-token', req.header('x-auth-token')).json(user);
};
exports.createOne = async (req, res) => {
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
  res.header('x-auth-token', token).json(user);
};
exports.updateOne = (req, res) => {
  /* TODO */
};
exports.removeOne = (req, res) => {
  /* TODO */
};
