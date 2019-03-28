const { Member } = require('../models/member');
const { User } = require('../models/user');

exports.getMany = async (req, res) => {
  const { _id: userId } = req.user;
  const members = await Member.find({ user: userId });
  res.json(members);
};

exports.getOne = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const member = await Member.findOne({ _id: id, user: userId });
  if (!member) return res.status(404).send('Member not found');
  res.json(member);
};

exports.createOne = async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id);
  if (!user) return res.status(400).send('Invalid user');

  const { name, email, dni, birthdate, phone, comments } = req.body;

  let member = await Member.findOne({ user: _id, dni });
  if (member)
    return res.status(400).send('Member with that dni already registerd');

  member = new Member({
    name,
    email,
    dni,
    birthdate,
    phone,
    comments,
    user: { _id },
  });
  await member.save();
  res.status(201).json(member);
};

exports.updateOne = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const member = await Member.findOneAndUpdate(
    { _id: id, user: userId },
    { ...req.body },
    { new: true }
  );

  if (!member) return res.status(404).send('Member not found');

  res.json(member);
};

exports.removeOne = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const member = await Member.findOneAndRemove({ _id: id, user: userId });

  if (!member) return res.status(404).send('Member not found.');

  res.json(member);
};
