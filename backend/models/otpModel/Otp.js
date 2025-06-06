const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  mobile: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 } // 5 mins
});

module.exports = mongoose.model('Otp', otpSchema);
