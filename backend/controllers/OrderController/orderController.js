const Order = require('../../models/patientModel/Order');
const Inventory = require('../../models/BloodBankModel/Inventory');

const placeOrder = async (req, res) => {
  try {
    const { bloodBank, bloodType, quantity, deliveryAddress } = req.body;
    const units = quantity;

    // Convert units to liters (1 unit = 0.45 liters)
    const quantityInLiters = units * 0.45;

    // Find inventory for that blood bank and blood type
    const inventory = await Inventory.findOne({ bloodBankId: bloodBank, bloodGroup: bloodType });

    if (!inventory || inventory.quantity < quantityInLiters) {
      return res.status(400).json({ message: "Insufficient blood units available." });
    }

    // Calculate price
    const totalPrice = inventory.pricePerLiter * quantityInLiters;

    // Create order
    const order = await Order.create({
      patient: req.user._id,
      bloodBank,
      bloodType,
      quantity: units,
      deliveryAddress,
    });

    // Deduct from inventory
    inventory.quantity -= quantityInLiters;
    await inventory.save();

    res.status(201).json({
      message: "Order placed successfully",
      totalPrice,
      order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error placing order" });
  }
};


const getOrderHistory = async (req, res) => {
  const orders = await Order.find({ patient: req.user._id }).populate('bloodBank');
  res.json(orders);
};


module.exports = {
  placeOrder,
  getOrderHistory,
};