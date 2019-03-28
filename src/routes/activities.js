const express = require('express');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const validateObjectId = require('../middleware/validateObjectId');
const { validateActivity } = require('../models/activity');
const activitiesController = require('../controllers/activities');

const router = express.Router();

router.get('/', [auth], asyncMiddleware(activitiesController.getMany));

router.get(
  '/:id',
  [auth, validateObjectId],
  asyncMiddleware(activitiesController.getOne)
);

router.post(
  '/',
  [auth, validate(validateActivity)],
  asyncMiddleware(activitiesController.createOne)
);

router.put(
  '/:id',
  [auth, validateObjectId, validate(validateActivity)],
  asyncMiddleware(activitiesController.updateOne)
);

router.delete(
  '/:id',
  [auth, validateObjectId],
  asyncMiddleware(activitiesController.removeOne)
);

module.exports = router;
