const mongoose = require("mongoose");

const bloodBankSchema = new mongoose.Schema({
  name: { type: String, required: true },
  licenseId: { type: String, required: true, unique: true },
  licenseDocumentUrl: { type: String, default: null },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contactNumber: String,
  emergencyContact: String,
  address: { type: String },
  location: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], index: "2dsphere" }, // [longitude, latitude]
  },
  isApproved: { type: Boolean, default: false },
});

module.exports = mongoose.model("BloodBank", bloodBankSchema);
