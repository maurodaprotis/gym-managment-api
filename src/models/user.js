const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 3,
      maxlength: 255,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      maxlength: 255,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 1024,
    },
    settings: {
      daysTolerance: {
        type: Number,
        default: 10,
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();

  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }

    this.password = hash;
    next();
  });
});

userSchema.methods.checkPassword = function(password) {
  const passwordHash = this.password;
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) return reject(err);

      resolve(same);
    });
  });
};

userSchema.methods.generateToken = function() {
  const token = jwt.sign(
    {
      _id: this._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXP,
    }
  );
  return token;
};

const User = mongoose.model('User', userSchema);

const validateUser = user => {
  const schema = {
    name: Joi.string()
      .min(3)
      .max(255)
      .required(),
    email: Joi.string()
      .max(255)
      .email()
      .required(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required(),
  };

  return Joi.validate(user, schema);
};

const validateCredentials = credentials => {
  const schema = {
    email: Joi.string()
      .email()
      .max(255)
      .required(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required(),
  };

  return Joi.validate(credentials, schema);
};

module.exports = {
  User,
  validateUser,
  validateCredentials,
};
