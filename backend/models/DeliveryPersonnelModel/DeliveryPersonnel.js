const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const deliveryPersonnelSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  vehicle: String,
  isAvailable: { type: Boolean, default: false },
  currentLocation: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], default: [0, 0] },
  },
  role: { type: String, default: "delivery" },
}, { timestamps: true });

deliveryPersonnelSchema.index({ currentLocation: "2dsphere" });

deliveryPersonnelSchema.pre("save", async function (next) {
  if (this.isModified("password")) this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("DeliveryPersonnel", deliveryPersonnelSchema);
