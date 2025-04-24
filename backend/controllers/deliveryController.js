// const DeliveryPersonnel = require('../models/Delivery');
// const asyncHandler = require('express-async-handler');

// const getAllDeliveries = asyncHandler(async (req, res) => {
//     const deliveries = await DeliveryPersonnel.find();
//     res.json(deliveries);
// });

// const getDeliveryById = asyncHandler(async (req, res) => {
//     const delivery = await DeliveryPersonnel.findById(req.params.id);
//     if (delivery) {
//         res.json(delivery);
//     } else {
//         res.status(404).json({ message: 'Delivery personnel not found' });
//     }
// });

// const updateDeliveryPersonnel = asyncHandler(async (req, res) => {
//     const delivery = await DeliveryPersonnel.findById(req.params.id);
//     if (delivery) {
//         delivery.name = req.body.name || delivery.name;
//         delivery.phone = req.body.phone || delivery.phone;
//         delivery.location = req.body.location || delivery.location;

//         const updatedDelivery = await delivery.save();
//         res.json(updatedDelivery);
//     } else {
//         res.status(404).json({ message: 'Delivery personnel not found' });
//     }
// });

// const deleteDeliveryPersonnel = asyncHandler(async (req, res) => {
//     const delivery = await DeliveryPersonnel.findById(req.params.id);
//     if (delivery) {
//         await delivery.remove();
//         res.json({ message: 'Delivery personnel removed' });
//     } else {
//         res.status(404).json({ message: 'Delivery personnel not found' });
//     }
// });

// module.exports = {
//     getAllDeliveries,
//     getDeliveryById,
//     updateDeliveryPersonnel,
//     deleteDeliveryPersonnel,
// };
