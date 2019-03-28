const express = require('express');
const auth = require('../middleware/auth');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const validate = require('../middleware/validate');

const { validateUser } = require('../models/user');

const usersController = require('../controllers/users');

const router = express.Router();

router.get('/me', auth, asyncMiddleware(usersController.me));
router.post(
  '/',
  validate(validateUser),
  asyncMiddleware(usersController.createOne)
);

module.exports = router;
