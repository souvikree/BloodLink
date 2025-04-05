const Order = require('../../models/patientModel/Order');

const placeOrder = async (req, res) => {
  const { bloodBank, bloodType, quantity, deliveryAddress } = req.body;

  const order = await Order.create({
    patient: req.user._id,
    bloodBank,
    bloodType,
    quantity,
    deliveryAddress,
  });

  res.status(201).json(order);
};

const getOrderHistory = async (req, res) => {
  const orders = await Order.find({ patient: req.user._id }).populate('bloodBank');
  res.json(orders);
};


module.exports = {
  placeOrder,
  getOrderHistory,
};