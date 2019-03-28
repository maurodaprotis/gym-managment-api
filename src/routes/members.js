const express = require('express');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const validateObjectId = require('../middleware/validateObjectId');
const { validateMember } = require('../models/member');
const membersController = require('../controllers/members');

const router = express.Router();

router.get('/', [auth], asyncMiddleware(membersController.getMany));

router.get(
  '/:id',
  [auth, validateObjectId],
  asyncMiddleware(membersController.getOne)
);

router.post(
  '/',
  [auth, validate(validateMember)],
  asyncMiddleware(membersController.createOne)
);

router.put(
  '/:id',
  [auth, validateObjectId, validate(validateMember)],
  asyncMiddleware(membersController.updateOne)
);

router.delete(
  '/:id',
  [auth, validateObjectId],
  asyncMiddleware(membersController.removeOne)
);

module.exports = router;
