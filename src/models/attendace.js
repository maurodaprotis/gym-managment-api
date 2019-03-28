const mongoose = require('mongoose');

const { Schema } = mongoose;

const attendanceSchema = new Schema({});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = {
  Attendance,
};
