const express = require('express');
const authController = require('../controllers/auth');
const { validateCredentials } = require('../models/user');
const validate = require('../middleware/validate');
const asyncMiddleware = require('../middleware/asyncMiddleware');

const router = express.Router();

router.post(
  '/login',
  validate(validateCredentials),
  asyncMiddleware(authController.login)
);

module.exports = router;
