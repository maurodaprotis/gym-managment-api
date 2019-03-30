const { Member } = require('../models/member');
const { User } = require('../models/user');
const { Activity } = require('../models/activity');

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
  const { _id: userId } = req.user;
  const user = await User.findById(userId);
  if (!user) return res.status(400).send('Invalid user');

  const { name, email, dni, birthdate, phone, comments, activityId } = req.body;

  let member = await Member.findOne({ user: userId, dni });

  if (member)
    return res.status(400).send('Member with that dni already registerd');

  const activity = await Activity.findOne({ _id: activityId, user: userId });

  if (!activity) return res.status(400).send('Activity not found');

  member = new Member({
    name,
    email,
    dni,
    birthdate,
    phone,
    comments,
    user: userId,
    activities: [
      {
        name: activity.name,
        _id: activity._id,
      },
    ],
  });
  await member.save();
  res.status(201).json(member);
};

exports.updateOne = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const { activityId } = req.body;
  const activity = await Activity.findOne({ _id: activityId, user: userId });
  const data = _.omit(req.body, ['activityId']);
  const member = await Member.findOneAndUpdate(
    { _id: id, user: userId },
    {
      ...data,
      $addToSet: {
        activities: {
          name: activity.name,
          _id: activity._id,
        },
      },
    },
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
