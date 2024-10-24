const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    bloodType: {
        type: String,
        required: true,
    },
    location: {
        type: { type: String, default: "Point" },
        coordinates: {
            type: [Number],
            required: true, // [longitude, latitude]
        },
    },
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
        },
    ],
}, {
    timestamps: true
});

// Password hashing before saving
patientSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Check password method
patientSchema.methods.checkPassword = function (candidatePassword, patientPassword) {
    return bcrypt.compare(candidatePassword, patientPassword);
};

module.exports = mongoose.model('Patient', patientSchema);
