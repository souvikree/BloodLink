const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  bloodBank: { type: mongoose.Schema.Types.ObjectId, ref: 'BloodBank', required: true },
  reservedUnits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' }], 
  bloodType: { type: String, required: true },
  quantity: { type: Number, required: true },
  deliveryAddress: { type: String, required: true },
  prescriptionUrl: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'ready', 'rejected', 'delivered', 'cancelled'],
    default: 'pending',
  },
  handlingCharge: { type: Number },
  serviceCharge: { type: Number },
  totalPrice: { type: Number },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  },
  deliveryLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: undefined }, // [longitude, latitude]
  },
  requestedAt: { type: Date, default: Date.now },
}, { timestamps: true });

orderSchema.index({ patient: 1, createdAt: -1 });


module.exports = mongoose.model('Order', orderSchema);
