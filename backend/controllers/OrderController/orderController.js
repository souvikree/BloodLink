const Order = require('../../models/patientModel/Order');
const Inventory = require('../../models/BloodBankModel/Inventory');
const handlingChargeMap = require('../../config/handlingCharges');
const { createNotification } = require('../../controllers/NotificationController/notificationController');



const placeOrder = async (req, res) => {
  try {
    const { bloodBank, bloodType, quantity, deliveryAddress } = req.body;
    const units = quantity;
    const io = req.app.get('io'); // Accessing Socket.IO instance

    // Convert units to liters (1 unit = 0.45 liters)
    // const quantityInLiters = units * 0.45;

    // Fetch inventory
    const inventory = await Inventory.findOne({ bloodBankId: bloodBank, bloodGroup: bloodType });

    if (!inventory || inventory.quantity < units) {
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
      prescriptionUrl,
      status: 'pending', // Add initial status
    });

    // Deduct from inventory
    inventory.quantity -= units;
    await inventory.save();

    // ✅ Create real-time notifications
    await createNotification(req.user._id, 'Patient', 'Your order is placed. Now wait for the request to be accepted.', io);
    await createNotification(bloodBank, 'BloodBank', 'New blood request received.', io);

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
  try {
    const orders = await Order.find({ patient: req.user._id }).populate('bloodBank');
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch order history" });
  }
};

module.exports = {
  placeOrder,
  getOrderHistory,
};
