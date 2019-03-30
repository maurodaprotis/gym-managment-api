const mongoose = require('mongoose');
const Joi = require('joi');
const { distanceInWords } = require('date-fns');
const { Payment } = require('./payment');
const { User } = require('./user');

const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

const statusEnum = ['APPROVED', 'PENDING', 'REJECTED'];

const attendanceSchema = new Schema(
  {
    status: {
      type: String,
      required: true,
      enum: statusEnum,
      default: 'PENDING',
    },
    member: {
      type: ObjectId,
      ref: 'Member',
      required: true,
    },
    activity: {
      type: ObjectId,
      ref: 'Activity',
      required: true,
    },
    user: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

attendanceSchema.pre('save', async function(next) {
  const creationDate = new Date(this.createdAt);
  const payment = await Payment.findOne({
    'member.memberId': this.member,
    'activity.activityId': this.activity,
    'period.from': {
      $lte: creationDate,
    },
    'period.to': {
      $gte: creationDate,
    },
  });
  if (payment) {
    this.status = 'APPROVED';
  } else {
    const user = await User.findById(this.user);
    if (creationDate.getDate() > user.settings.daysTolerance) {
      this.status = 'REJECTED';
    }
  }

  next();
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

const validateAttendance = attendance => {
  const schema = {
    status: Joi.string()
      .optional()
      .valid(statusEnum),
    memberId: Joi.objectId().required(),
    activityId: Joi.objectId().required(),
  };

  return Joi.validate(attendance, schema);
};

module.exports = {
  Attendance,
  validateAttendance,
};
