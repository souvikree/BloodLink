// # Donor schema
const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
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
    donationHistory: [
        {
            date: { type: Date, default: Date.now },
            bloodBank: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'BloodBank',
            },
        },
    ],
}, {
    timestamps: true
});

module.exports = mongoose.model('Donor', donorSchema);
