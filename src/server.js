require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const { connect } = require('./utils/db');

const PORT = process.env.PORT || 2093;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
}

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
