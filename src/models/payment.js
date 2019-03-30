const mongoose = require('mongoose');
const Joi = require('joi');

const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

const paymentSchema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    isPartial: {
      type: Boolean,
      default: false,
    },
    registerDebt: {
      type: Boolean,
      default: false,
    },
    comment: {
      type: String,
      maxlength: 255,
    },
    period: {
      from: {
        type: Date,
        required: true,
      },
      to: {
        type: Date,
        required: true,
      },
    },
    activity: {
      name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255,
      },
      activityId: {
        type: ObjectId,
        ref: 'Activity',
        required: true,
      },
    },
    member: {
      name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255,
      },
      dni: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255,
      },
      memberId: {
        type: ObjectId,
        ref: 'Member',
        required: true,
      },
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

paymentSchema.index(
  {
    'member.memberId': 1,
    'activity.activityId': 1,
    'period.from': 1,
    'period.to': 1,
  },
  { unique: true }
);

const Payment = mongoose.model('Payment', paymentSchema);

Payment.on('index', err => {
  console.log(err);
});

const validatePayment = payment => {
  const schema = {
    amount: Joi.when('isPartial', {
      is: true,
      then: Joi.number()
        .min(0)
        .required(),
      otherwise: Joi.number()
        .min(0)
        .optional(),
    }),
    isPartial: Joi.bool().optional(),
    registerDebt: Joi.bool().optional(),
    comment: Joi.string()
      .max(255)
      .optional(),
    period: Joi.object({
      from: Joi.date().required(),
      to: Joi.date().required(),
    }),
    activityId: Joi.objectId().required(),
    memberId: Joi.objectId().required(),
  };

  return Joi.validate(payment, schema);
};

module.exports = {
  Payment,
  validatePayment,
};
