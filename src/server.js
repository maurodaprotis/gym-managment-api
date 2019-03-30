require('dotenv').config();
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const { connect } = require('./utils/db');
const errorHandler = require('./middleware/errorHandler');

const membersRoutes = require('./routes/members');
const activitiesRoutes = require('./routes/activities');
const paymentsRoutes = require('./routes/payments');
const usersRoutes = require('./routes/users');
const attendancesRoutes = require('./routes/attendances');

const PORT = process.env.PORT || 2093;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
}

app.use('/activities', activitiesRoutes);
app.use('/members', membersRoutes);
app.use('/payments', paymentsRoutes);
app.use('/users', usersRoutes);
app.use('/attendances', attendancesRoutes);

app.use(errorHandler);

const start = async () => {
  try {
    await connect();
    app.listen(PORT, () => {
      console.log(`🚀 REST API ready on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  start,
};
