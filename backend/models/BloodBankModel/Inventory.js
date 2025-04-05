const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  bloodBankId: { type: mongoose.Schema.Types.ObjectId, ref: "BloodBank" },
  bloodGroup: { type: String, enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"], required: true },
  quantity: { type: Number, default: 0 },
  pricePerLiter: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Inventory", inventorySchema);
