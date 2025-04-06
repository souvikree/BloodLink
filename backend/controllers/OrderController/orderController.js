const Order = require('../../models/patientModel/Order');
const Inventory = require('../../models/BloodBankModel/Inventory');
const handlingChargeMap = require('../../config/handlingCharges');
// const axios = require("axios");

const placeOrder = async (req, res) => {
  try {
    const { bloodBank, bloodType, quantity, deliveryAddress } = req.body;
    const units = quantity;

    // Convert units to liters (1 unit = 0.45 liters)
    const quantityInLiters = units * 0.45;

    // Fetch inventory
    const inventory = await Inventory.findOne({ bloodBankId: bloodBank, bloodGroup: bloodType });

    if (!inventory || inventory.quantity < quantityInLiters) {
      return res.status(400).json({ message: "Insufficient blood units available." });
    }

    // Get handling charge per unit (bag)
    const handlingChargePerBag = handlingChargeMap[bloodType];
    if (!handlingChargePerBag) {
      return res.status(400).json({ message: "Invalid or unsupported blood type." });
    }

    const totalHandlingCharge = units * handlingChargePerBag;
    const serviceCharge = 30; // Flat rate for now
    const totalPrice = totalHandlingCharge + serviceCharge;

    // ✅ Get prescription URL from Cloudinary (if uploaded)
    const prescriptionUrl = req.file?.path || null;

    // Create the order
    const order = await Order.create({
      patient: req.user._id,
      bloodBank,
      bloodType,
      quantity: units,
      deliveryAddress,
      handlingCharge: totalHandlingCharge,
      serviceCharge,
      totalPrice,
      prescriptionUrl, // ✅ Save the Cloudinary URL here
    });

    // Deduct from inventory
    inventory.quantity -= quantityInLiters;
    await inventory.save();

    res.status(201).json({
      message: "Order placed successfully",
      order,
      charges: {
        handlingChargePerBag,
        quantity: units,
        totalHandlingCharge,
        serviceCharge,
        totalPrice
      }
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