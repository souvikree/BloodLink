// // # Order schema
// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         required: true,
//     },
//     bloodBank: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'BloodBank',
//         required: true,
//     },
//     bloodType: {
//         type: String,
//         required: true,
//     },
//     quantity: {
//         type: Number,
//         required: true,
//     },
//     status: {
//         type: String,
//         enum: ['pending', 'accepted', 'in_transit', 'delivered', 'cancelled'],
//         default: 'pending',
//     },
//     delivery: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Delivery',
//     },
//     deliveryTime: {
//         type: Date,
//     },
// }, {
//     timestamps: true
// });

// module.exports = mongoose.model('Order', orderSchema);
