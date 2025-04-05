const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bloodGroup: { type: String },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { 
      type: [Number], 
      required: true,
       
    }, // [longitude, latitude]
  },
  emergencyContact: String,
  medicalRecords: String, // URL or filename
}, { timestamps: true });

patientSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

patientSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

patientSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Patient', patientSchema);
