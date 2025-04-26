const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  bloodBankId: { type: mongoose.Schema.Types.ObjectId, ref: "BloodBank", required: true },
  bloodGroup: { 
    type: String, 
    enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"], 
    required: true 
  },
  quantity: { type: Number, default: 1 }, // 1 unit per entry (best practice)
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: "Donor" }, // New field
  expiryDate: { type: Date, required: true }, // New field
  status: { type: String, enum: ["available", "reserved", "expired"], default: "available" },
}, { timestamps: true });

module.exports = mongoose.model("Inventory", inventorySchema);
