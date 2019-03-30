const express = require('express');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const validateObjectId = require('../middleware/validateObjectId');
const { validatePayment } = require('../models/payment');
const paymentsController = require('../controllers/payments');

const router = express.Router();

router.get('/', [auth], asyncMiddleware(paymentsController.getMany));

router.get(
  '/:id',
  [auth, validateObjectId],
  asyncMiddleware(paymentsController.getOne)
);

router.post(
  '/',
  [auth, validate(validatePayment)],
  asyncMiddleware(paymentsController.createOne)
);

/* 
TODO
router.put(
  '/:id',
  [auth, validateObjectId, validate(validatePayment)],
  asyncMiddleware(paymentsController.updateOne)
); */

router.delete(
  '/:id',
  [auth, validateObjectId],
  asyncMiddleware(paymentsController.removeOne)
);

module.exports = router;
