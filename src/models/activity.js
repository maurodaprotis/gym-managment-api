const mongoose = require('mongoose');
const Joi = require('joi');

const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

const activitySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
      trim: true,
    },
    timesPerWeek: {
      type: Number,
      required: true,
      default: 0,
      max: 7,
      min: 0,
    },
    price: {
      type: Number,
      min: 0,
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

activitySchema.index({ user: 1, _id: 1 }, { unique: true });

const Activity = mongoose.model('Activity', activitySchema);

const validateActivity = activity => {
  const schema = {
    name: Joi.string()
      .min(3)
      .max(255)
      .required(),
    timesPerWeek: Joi.number()
      .min(0)
      .max(7)
      .required(),
    price: Joi.number()
      .min(0)
      .required(),
  };

  return Joi.validate(activity, schema);
};

module.exports = {
  Activity,
  validateActivity,
};
