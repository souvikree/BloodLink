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
      patient: req.user.id,
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


const cancelOrder = async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user._id;
  const io = req.app.get('io');

  try {
    // Find the order
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Authorization: Only the patient who placed the order can cancel
    if (!order.patient.equals(userId)) {
      return res.status(403).json({ message: 'Unauthorized to cancel this order' });
    }

    // Allow cancellation only if the order is pending or accepted
    if (!['pending', 'accepted'].includes(order.status)) {
      return res.status(400).json({ message: `Cannot cancel an order that is already ${order.status}` });
    }

    // Use atomic update to avoid race condition
    const updatedOrder = await Order.findOneAndUpdate(
      {
        _id: orderId,
        status: { $in: ['pending', 'accepted'] } // extra safety
      },
      {
        status: 'cancelled'
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(409).json({ message: 'Order could not be cancelled (maybe already processed)' });
    }

    // ✅ Restore inventory if already deducted
    const inventory = await Inventory.findOne({
      bloodBankId: order.bloodBank,
      bloodGroup: order.bloodType
    });

    if (inventory) {
      inventory.quantity += order.quantity; // restore stock
      await inventory.save();
    }

    // ✅ Send notifications
    await createNotification(order.patient, 'Patient', `Your order for ${order.bloodType} blood was cancelled.`, io);
    await createNotification(order.bloodBank, 'BloodBank', `A patient cancelled their ${order.bloodType} order.`, io);

    res.status(200).json({ message: 'Order cancelled successfully', order: updatedOrder });

  } catch (err) {
    console.error("Error cancelling order:", err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  placeOrder,
  getOrderHistory,
  cancelOrder,
};
