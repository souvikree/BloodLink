const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema(
  {
    bloodBankId: { type: mongoose.Schema.Types.ObjectId, ref: "BloodBank", required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    bloodGroup: { type: String, enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"], required: true },
    contactNumber: { type: String, required: true },
    address: { type: String },
    email: { type: String },
    lastDonationDate: { type: Date },
    isActive: { type: Boolean, default: true }, // Soft delete support
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donor", donorSchema);
