const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryPersonnel" },
  status: {
    type: String,
    enum: ["assigned", "picked_up", "on_the_way", "delivered", "failed"],
    default: "assigned",
  },
  timestamps: {
    assigned: Date,
    picked_up: Date,
    on_the_way: Date,
    delivered: Date,
    failed: Date,
  },
  currentLocation: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], default: [0, 0] },
  },
}, { timestamps: true });

module.exports = mongoose.model("Delivery", deliverySchema);
