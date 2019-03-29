const mongoose = require('mongoose');
const Joi = require('joi');

const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;

const memberSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
      trim: true,
      lowercase: true,
    },
    dni: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
    },
    birthdate: {
      type: Date,
      required: true,
    },
    phone: {
      type: String,
      minlength: 3,
      maxlength: 255,
      required: true,
    },
    user: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    activities: [
      {
        name: {
          type: String,
          required: true,
          minlength: 3,
          maxlength: 255,
        },
        _id: {
          type: ObjectId,
          required: true,
          ref: 'Activity',
        },
      },
    ],
    debt: [
      {
        payment: {
          type: ObjectId,
          rel: 'Payment',
          required: true,
        },
        amount: {
          type: Number,
          required: true,
          min: 0,
        },
        createdAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    comments: [
      {
        comment: {
          type: String,
          required: true,
          minlength: 3,
          maxlength: 255,
        },
        createdAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

memberSchema.index({ user: 1, dni: 1 }, { unique: true });

const Member = mongoose.model('Member', memberSchema);

const validateMember = member => {
  const schema = {
    name: Joi.string()
      .min(3)
      .max(255)
      .required(),
    email: Joi.string()
      .min(3)
      .max(255)
      .required()
      .email(),
    dni: Joi.string()
      .min(3)
      .max(255)
      .required(),
    birthdate: Joi.date().required(),
    phone: Joi.string()
      .min(3)
      .max(255)
      .required(),
    comments: Joi.array().items(
      Joi.object({
        comment: Joi.string()
          .min(3)
          .max(255)
          .required(),
      })
    ),
    activityId: Joi.objectId().required(),
  };

  return Joi.validate(member, schema);
};

module.exports = {
  Member,
  validateMember,
};
