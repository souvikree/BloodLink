const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const axios = require("axios");

const xlsx = require("xlsx");
const fs = require("fs");

const BloodBank = require("../../models/BloodBankModel/BloodBank");
const Order = require("../../models/patientModel/Order");
const Inventory = require("../../models/BloodBankModel/Inventory");
const { getCoordinates } = require("../../utils/geocode");
const { updateInventory, getInventoryStats } = require("../../services/BloodBankService/inventoryService");
// const { getOrdersByBank } = require("../../services/OrderService/orderService");


exports.register = async (req, res) => {
  try {
    const { name, licenseId, email, password, contactNumber, address } = req.body;

    const existing = await BloodBank.findOne({ email });
    if (existing) return res.status(400).json({ msg: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    const bloodBank = await BloodBank.create({
      name,
      licenseId,
      email,
      password: hashed,
      contactNumber,
      address,
      status: "pending", // 🚦 Add this for approval process
      licenseDocumentUrl: null, // ⛔ To be uploaded after registration
      // location: { type: "Point", coordinates } // optional if you use geocoding
    });

    res.status(201).json({
      msg: "Registration successful. Please upload your license certificate to complete the process.",
      bloodBankId: bloodBank._id,
    });

  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ msg: "Server error during registration" });
  }
};


// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const bank = await BloodBank.findOne({ email });
  if (!bank || !await bcrypt.compare(password, bank.password))
    return res.status(400).json({ msg: "Invalid credentials" });

  const token = jwt.sign({ id: bank._id, role: "bloodbank" }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ token, bank });
};

// Profile
exports.getProfile = async (req, res) => {
  const bank = await BloodBank.findById(req.user.id);
  res.json(bank);
};

exports.updateProfile = async (req, res) => {
  const { contactNumber, emergencyContact, address } = req.body;
  let updateData = { contactNumber, emergencyContact };

  if (address) {
    const coordinates = await getCoordinates(address);
    updateData.address = address;
    updateData.location = { type: "Point", coordinates };
  }

  const updated = await BloodBank.findByIdAndUpdate(req.user.id, updateData, { new: true });
  res.json(updated);
};

// Inventory

exports.addInventory = async (req, res) => {
  try {
    const { bloodGroup, quantity } = req.body;
    const bloodBankId = req.user.id;

    // Check if this blood group is already added for this blood bank
    const existing = await Inventory.findOne({ bloodBankId, bloodGroup });

    if (existing) {
      // Update the quantity by adding the new quantity
      existing.quantity += quantity;
      await existing.save();

      return res.status(200).json({
        message: "Existing inventory updated successfully.",
        inventory: existing,
      });
    }

    // Create a new inventory entry
    const inventory = new Inventory({
      bloodGroup,
      quantity,
      bloodBankId,
    });

    await inventory.save();

    res.status(201).json({
      message: "New inventory added successfully.",
      inventory,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while updating inventory." });
  }
};


//=====================
//*BULK ADD INVENTORY*//
//======================
exports.bulkUploadInventory = async (req, res) => {
  try {
    const fileUrl = req.file?.path; // Cloudinary URL
    if (!fileUrl) {
      return res.status(400).json({ error: "File upload failed." });
    }

    // Download the file from Cloudinary
    const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
    const workbook = xlsx.read(response.data, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    const bloodBankId = req.user.id;
    const validBloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
    const errors = [];
    let inserted = 0;
    let updated = 0;

    for (let i = 0; i < data.length; i++) {
      const { bloodGroup, quantity } = data[i];

      if (!bloodGroup || quantity == null) {
        errors.push({ row: i + 2, error: "Missing required fields" });
        continue;
      }

      if (!validBloodGroups.includes(bloodGroup)) {
        errors.push({ row: i + 2, error: "Invalid blood group" });
        continue;
      }

      const existing = await Inventory.findOne({ bloodBankId, bloodGroup });

      if (existing) {
        existing.quantity += Number(quantity);
        await existing.save();
        updated++;
      } else {
        await Inventory.create({
          bloodGroup,
          quantity: Number(quantity),
          bloodBankId,
        });
        inserted++;
      }
    }

    res.status(200).json({
      message: "Bulk upload completed",
      inserted,
      updated,
      errors,
    });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: "Server error during upload" });
  }
};


exports.uploadLicense = async (req, res) => {
  try {
    const bloodBankId = req.user.id;

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const updated = await BloodBank.findByIdAndUpdate(
      bloodBankId,
      { licenseDocumentUrl: req.file.path },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Blood bank not found" });
    }

    res.status(200).json({
      message: "License uploaded successfully. Verification will take 3–4 hours.",
      licenseUrl: updated.licenseDocumentUrl,
    });
  } catch (err) {
    console.error("License Upload Error:", err);
    res.status(500).json({ message: "Server error during license upload" });
  }
};


// exports.updateInventory = async (req, res) => {
//   await updateInventory(req.user.id, req.body); // expects array [{bloodGroup, quantity}]
//   res.json({ msg: "Inventory updated" });
// };

exports.updateInventory = async (req, res) => {
  try {
    const { inventoryId } = req.params;
    const { quantity } = req.body;

    const inventory = await Inventory.findOneAndUpdate(
      { _id: inventoryId, bloodBankId: req.user.id },
      { quantity },
      { new: true }
    );

    if (!inventory) {
      return res.status(404).json({ message: "Inventory item not found." });
    }

    res.status(200).json({ message: "Inventory updated.", inventory });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getInventory = async (req, res) => {
  const inv = await getInventoryStats(req.user.id);
  res.json(inv);
};

// Orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ bloodBank: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["accepted", "rejected", "ready"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    const order = await Order.findOneAndUpdate(
      { _id: orderId, bloodBank: req.user.id },
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({ message: `Order status updated to ${status}.`, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

