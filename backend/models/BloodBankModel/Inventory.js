const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  bloodBankId: { type: mongoose.Schema.Types.ObjectId, ref: "BloodBank" },
  bloodGroup: { type: String, enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"], required: true },
  quantity: { type: Number, default: 0 },
});

module.exports = mongoose.model("Inventory", inventorySchema);
