const Order = require("../../models/patientModel/Order");

exports.getOrdersByBank = async (bloodBankId) => {
  return Order.find({ bloodBankId }).sort({ createdAt: -1 });
};

// exports.updateOrderStatus = async (orderId, status, pickupTime) => {
//   return Order.findByIdAndUpdate(orderId, { status, pickupTime }, { new: true });
// };
