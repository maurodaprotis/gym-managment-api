const { Attendance } = require('../models/attendance');
const { User } = require('../models/user');
const { Member } = require('../models/member');
const { Activity } = require('../models/activity');

exports.getMany = async (req, res) => {
  const { _id: userId } = req.user;
  const attendances = await Attendance.find({ user: userId });
  res.json(attendances);
};

exports.getOne = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const attendance = await Attendance.findOne({ _id: id, user: userId });
  if (!attendance) return res.status(404).send('Attendance not found');
  res.json(attendance);
};

exports.createOne = async (req, res) => {
  const { _id: userId } = req.user;
  const user = await User.findById(userId);
  if (!user) return res.status(400).send('Invalid user');

  const { status, memberId, activityId } = req.body;

  const member = await Member.findOne({ _id: memberId, user: userId });
  const activity = await Member.findOne({ _id: memberId, user: userId });
  if (!member || !activity)
    return res.status(400).send('Invalid member or activity');

  const attendance = new Attendance({
    status,
    member: memberId,
    activity: activityId,
    user: userId,
  });
  await attendance.save();
  res.status(201).json(attendance);
};

exports.updateOne = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const { activityId } = req.body;
  const activity = await Activity.findOne({ _id: activityId, user: userId });
  const data = _.omit(req.body, ['activityId']);
  const attendance = await Attendance.findOneAndUpdate(
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

  if (!attendance) return res.status(404).send('Attendance not found');

  res.json(attendance);
};

exports.removeOne = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const attendance = await Attendance.findOneAndRemove({
    _id: id,
    user: userId,
  });

  if (!attendance) return res.status(404).send('Attendance not found.');

  res.json(attendance);
};
