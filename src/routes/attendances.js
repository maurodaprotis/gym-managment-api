const express = require('express');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const validateObjectId = require('../middleware/validateObjectId');
const { validateAttendance } = require('../models/attendance');
const attendancesController = require('../controllers/attendances');

const router = express.Router();

router.get('/', [auth], asyncMiddleware(attendancesController.getMany));

router.get(
  '/:id',
  [auth, validateObjectId],
  asyncMiddleware(attendancesController.getOne)
);

router.post(
  '/',
  [auth, validate(validateAttendance)],
  asyncMiddleware(attendancesController.createOne)
);

router.put(
  '/:id',
  [auth, validateObjectId, validate(validateAttendance)],
  asyncMiddleware(attendancesController.updateOne)
);

router.delete(
  '/:id',
  [auth, validateObjectId],
  asyncMiddleware(attendancesController.removeOne)
);

module.exports = router;
