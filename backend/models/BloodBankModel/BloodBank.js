const mongoose = require("mongoose");

const bloodBankSchema = new mongoose.Schema({
  name: { type: String, required: true },
  licenseId: { type: String, required: true, unique: true },
  licenseDocumentUrl: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contactNumber: String,
  emergencyContact: String,
  address: { type: String },
  location: {
    type: {
      type: String,
      enum: ["Point"], // Only allow "Point"
      required: true,
      default: "Point"
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  isApproved: { type: Boolean, default: false },
});

bloodBankSchema.index({ location: "2dsphere" });

module.exports = mongoose.models.BloodBank || mongoose.model("BloodBank", bloodBankSchema);
