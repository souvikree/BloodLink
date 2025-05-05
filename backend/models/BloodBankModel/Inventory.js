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
  status: { type: String, enum: ["available", "reserved", "expired", "used"], default: "available" },
  expiredAt: { type: Date, default: null }, 
}, { timestamps: true });

// Add TTL index on expiredAt
inventorySchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Inventory", inventorySchema);
