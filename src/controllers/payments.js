const { startOfMonth, endOfMonth } = require('date-fns');
const { Payment } = require('../models/payment');
const { User } = require('../models/user');
const { Member } = require('../models/member');
const { Activity } = require('../models/activity');

exports.getMany = async (req, res) => {
  const { _id: userId } = req.user;
  const payments = await Payment.find({ user: userId });
  res.json(payments);
};

exports.getOne = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const payment = await Payment.findOne({ _id: id, user: userId });
  if (!payment) return res.status(404).send('Payment not found');
  res.json(payment);
};

exports.createOne = async (req, res) => {
  const { _id: userId } = req.user;
  const user = await User.findById(userId);
  if (!user) return res.status(400).send('Invalid user');

  const {
    amount,
    isPartial,
    registerDebt,
    comment,
    period,
    activityId,
    memberId,
  } = req.body;

  const activity = await Activity.findOne({ _id: activityId, user: userId });
  const member = await Member.findOne({ _id: memberId, user: userId });
  if (!member || !activity)
    return res.status(400).send('Invalid member or activity');
  const payment = new Payment({
    amount: !isPartial ? activity.price : amount,
    isPartial,
    registerDebt,
    comment,
    period: period || {
      from: startOfMonth(Date.now()),
      to: endOfMonth(Date.now()),
    },
    member: {
      name: member.name,
      dni: member.dni,
      _id: member._id,
    },
    activity: {
      name: activity.name,
      _id: activity._id,
    },
    user: userId,
  });
  await payment.save();

  if (registerDebt)
    member.debt.push({
      payment: payment._id,
      amount: activity.price - amount,
    });

  const memberHasActivity = member.activities.find(
    a => a._id.toString() === activity._id.toString()
  );
  console.log(memberHasActivity);
  if (!memberHasActivity) {
    member.activities.push({
      name: activity.name,
      _id: activity._id,
    });
  }

  if (!memberHasActivity || registerDebt) member.save();

  res.status(201).json(payment);
};

exports.updateOne = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const payment = await Payment.findOneAndUpdate(
    { _id: id, user: userId },
    { ...req.body },
    { new: true }
  );

  if (!payment) return res.status(404).send('Payment not found');

  res.json(payment);
};

exports.removeOne = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const payment = await Payment.findOneAndRemove({ _id: id, user: userId });

  if (!payment) return res.status(404).send('Payment not found.');

  res.json(payment);
};
