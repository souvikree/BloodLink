const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Ensure bcrypt is imported

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
    password: { 
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

// Password hashing before saving
// donorSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) 
//         return next();
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
// });

module.exports = mongoose.model('Donor', donorSchema);
