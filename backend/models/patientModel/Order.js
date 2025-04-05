const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  bloodBank: { type: mongoose.Schema.Types.ObjectId, ref: 'BloodBank', required: true },
  bloodType: { type: String, required: true },
  quantity: Number,
  deliveryAddress: String,
  status: {
    type: String,
    enum: ['pending', 'accepted', 'delivered'],
    default: 'pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
