const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  bloodGroup: { type: String },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { 
      type: [Number], 
      default: undefined,
       
    }, 
  },
  // emergencyContact: String,
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  medicalRecords: String, // URL or filename
}, { timestamps: true });



patientSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Patient', patientSchema);
