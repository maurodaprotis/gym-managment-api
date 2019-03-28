const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  const valid = ObjectId.isValid(id);

  if (!valid) return res.status(404).send('Invalid Id');

  next();
};

module.exports = validateObjectId;
