// # Blood bank schema
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const bloodBankSchema = new mongoose.Schema({
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
    location: {
        type: { type: String, default: "Point" },
        coordinates: {
            type: [Number],
            required: true, // [longitude, latitude]
        },
    },
    bloodInventory: [
        {
            bloodType: { type: String, required: true },
            quantity: { type: Number, required: true },
        },
    ],
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
// bloodBankSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) 
//         return next();

//    const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
// });

module.exports = mongoose.model('BloodBank', bloodBankSchema);
