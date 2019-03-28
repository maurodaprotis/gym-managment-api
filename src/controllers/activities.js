const { Activity } = require('../models/activity');
const { User } = require('../models/user');

exports.getMany = async (req, res) => {
  const { _id: userId } = req.user;
  const activitys = await Activity.find({ user: userId });
  res.json(activitys);
};

exports.getOne = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const activity = await Activity.findOne({ _id: id, user: userId });
  if (!activity) return res.status(404).send('Activity not found');
  res.json(activity);
};

exports.createOne = async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id);
  if (!user) return res.status(400).send('Invalid user');

  const { name, timesPerWeek, price } = req.body;

  const activity = new Activity({
    name,
    timesPerWeek,
    price,
    user: { _id },
  });
  await activity.save();
  res.status(201).json(activity);
};

exports.updateOne = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const activity = await Activity.findOneAndUpdate(
    { _id: id, user: userId },
    { ...req.body },
    { new: true }
  );

  if (!activity) return res.status(404).send('Activity not found');

  res.json(activity);
};

exports.removeOne = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const activity = await Activity.findOneAndRemove({ _id: id, user: userId });

  if (!activity) return res.status(404).send('Activity not found.');

  res.json(activity);
};
