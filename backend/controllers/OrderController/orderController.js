const Order = require("../../models/patientModel/Order");
const Inventory = require("../../models/BloodBankModel/Inventory");
const handlingChargeMap = require("../../config/handlingCharges");
const {
  createNotification,
} = require("../../controllers/NotificationController/notificationController");
const { getCoordinates } = require("../../utils/geocode");
const orderStatusQueue = require("../../queues/orderStatusQueue");
const BloodBank = require("../../models/BloodBankModel/BloodBank");

const placeOrder = async (req, res) => {
  try {
    const { bloodBank, bloodType, quantity, deliveryAddress } = req.body;
    const units = quantity;
    const io = req.app.get("io");

    // ✅ Fetch the required number of available units
    const availableUnits = await Inventory.find({
      bloodBankId: bloodBank,
      bloodGroup: bloodType,
      status: "available",
    })
      .sort({ expiryDate: 1 }) // Prefer oldest units first
      .limit(units); // Limit to needed units only

    if (availableUnits.length < units) {
      return res
        .status(400)
        .json({ message: "Insufficient blood units available." });
    }

    // ✅ Calculate charges
    const handlingChargePerBag = handlingChargeMap[bloodType];
    if (!handlingChargePerBag) {
      return res
        .status(400)
        .json({ message: "Invalid or unsupported blood type." });
    }

    const totalHandlingCharge = units * handlingChargePerBag;
    const serviceCharge = 30;
    const totalPrice = totalHandlingCharge + serviceCharge;

    // ✅ Prescription URL
    const prescriptionUrl = req.file?.path || null;

    const deliveryCoordinates = await getCoordinates(deliveryAddress);
    if (!deliveryCoordinates)
      return res
        .status(400)
        .json({
          message: "Invalid address. Please provide a correct address.",
        });

    // ✅ Create the Order
    const order = await Order.create({
      patient: req.user.id,
      bloodBank,
      bloodType,
      quantity: units,
      deliveryAddress,
      deliveryLocation: {
        type: "Point",
        coordinates: deliveryCoordinates,
      },
      handlingCharge: totalHandlingCharge,
      serviceCharge,
      totalPrice,
      prescriptionUrl,
      status: "pending",
      reservedUnits: availableUnits.map((unit) => unit._id), // ✅ Save reserved unit IDs if you want
    });

    const populatedBloodBank = await BloodBank.findById(bloodBank).lean();
    const [lng, lat] = populatedBloodBank.location.coordinates;

    const mapLinks = {
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      appleMapsUrl: `http://maps.apple.com/?q=${lat},${lng}`,
    };

    // ✅ Update Inventory (mark units as reserved or sold)
    await Inventory.updateMany(
      { _id: { $in: availableUnits.map((unit) => unit._id) } },
      { $set: { status: "reserved" } } // Or 'sold' depending on your flow
    );

    // ✅ Schedule auto-reject job after 24 hours
    await orderStatusQueue.add(
      "auto-reject-order",
      { orderId: order._id.toString() },
      {
        delay: 24 * 60 * 60 * 1000,
        jobId: `reject_${order._id}`,
      }
    );

    // ✅ Real-time Notifications
    await createNotification(
      req.user._id,
      "Patient",
      "Your order is placed. Now wait for the request to be accepted.",
      io
    );
    await createNotification(
      bloodBank,
      "BloodBank",
      "New blood request received.",
      io
    );

    res.status(201).json({
      message: "Order placed successfully",
      order,
      charges: {
        handlingChargePerBag,
        quantity: units,
        totalHandlingCharge,
        serviceCharge,
        totalPrice,
      },
      bloodBankDetails: {
        name: populatedBloodBank.name,
        address: populatedBloodBank.address,
        contactNumber: populatedBloodBank.contactNumber,
        mapLinks,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error placing order" });
  }
};

const getCharges = async (req, res) => {
  try {
    const { bloodType } = req.params;

    const handlingChargePerBag = handlingChargeMap[bloodType];
    if (!handlingChargePerBag) {
      return res
        .status(400)
        .json({ message: "Invalid or unsupported blood type." });
    }

    const serviceCharge = 30; // Flat fixed service charge for now

    res.status(200).json({
      handlingChargePerBag,
      serviceCharge,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching charges" });
  }
};

const getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ patient: req.user._id })
      .sort({ createdAt: -1 }) // Sort by newest first
      .populate("bloodBank")
      .lean();

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch order history" });
  }
};


const cancelOrder = async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user._id;
  const io = req.app.get("io");

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (!order.patient.equals(userId)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (!["pending", "accepted"].includes(order.status)) {
      return res
        .status(400)
        .json({
          message: `Cannot cancel an order that is already ${order.status}`,
        });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, status: { $in: ["pending", "accepted"] } },
      { status: "cancelled" },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(409).json({ message: "Order could not be cancelled" });
    }

    // ✅ Restore only reserved (not used) units
    await Inventory.updateMany(
      { _id: { $in: order.reservedUnits }, status: "reserved" },
      { $set: { status: "available" } }
    );

    await createNotification(
      order.patient,
      "Patient",
      `Your order for ${order.bloodType} blood was cancelled.`,
      io
    );
    await createNotification(
      order.bloodBank,
      "BloodBank",
      `A patient cancelled their ${order.bloodType} order.`,
      io
    );

    res
      .status(200)
      .json({ message: "Order cancelled successfully", order: updatedOrder });
  } catch (err) {
    console.error("Error cancelling order:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  placeOrder,
  getOrderHistory,
  cancelOrder,
  getCharges,
};
