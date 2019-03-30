const mongoose = require('mongoose');
const _ = require('lodash');
const { User } = require('./src/models/user');
const { Payment } = require('./src/models/payment');
const { Member } = require('./src/models/member');
const { Attendance } = require('./src/models/attendance');
const { Activity } = require('./src/models/activity');

const models = { User, Member, Activity, Payment, Attendance };

const url = 'mongodb://localhost/gym-managment-testing';

global.newId = () => mongoose.Types.ObjectId();

const remove = collection =>
  new Promise((resolve, reject) => {
    collection.deleteMany({}, err => {
      if (err) return reject(err);
      resolve();
    });
  });

beforeEach(async done => {
  function clearDB() {
    return Promise.all(_.map(mongoose.connection.collections, c => remove(c)));
  }

  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(url, {
        useNewUrlParser: true,
        useCreateIndex: true,
      });
      await clearDB();
      await Promise.all(Object.keys(models).map(name => models[name].init()));
    } catch (e) {
      console.log('connection error');
      console.error(e);
      throw e;
    }
  } else {
    await clearDB();
  }
  done();
});

afterEach(async done => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
  return done();
});

afterAll(done => done());
