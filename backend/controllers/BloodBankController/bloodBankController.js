const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");


const axios = require("axios");

const xlsx = require("xlsx");
const fs = require("fs");

const BloodBank = require("../../models/BloodBankModel/BloodBank");
const Order = require("../../models/patientModel/Order");
const Inventory = require("../../models/BloodBankModel/Inventory");
const { getCoordinates } = require("../../utils/geocode");
const { getInventoryStats } = require("../../services/BloodBankService/inventoryService");


exports.register = async (req, res) => {
  try {
    const { name, licenseId, email, password, contactNumber, address } = req.body;

    const existing = await BloodBank.findOne({ email });
    if (existing) return res.status(400).json({ msg: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    let location = null;
    if (address) {
      const coordinates = await getCoordinates(address); // 🗺️ Get lat/lng
      location = { type: "Point", coordinates };
    }

    const bloodBank = await BloodBank.create({
      name,
      licenseId,
      email,
      password: hashed,
      contactNumber,
      address,   // 📄 Save the text address
      location,  // 📍 Save the coordinates
      status: "pending",
      licenseDocumentUrl: null,
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
  try {
    const { contactNumber, emergencyContact, address } = req.body;
    const updateData = {};

    if (contactNumber) updateData.contactNumber = contactNumber;
    if (emergencyContact) updateData.emergencyContact = emergencyContact;

    if (address) {
      const coordinates = await getCoordinates(address); // 🗺️ Geocode new address
      updateData.address = address;                       // 📄 Update text address
      updateData.location = { type: "Point", coordinates }; // 📍 Update geolocation
    }

    const updatedBloodBank = await BloodBank.findByIdAndUpdate(req.user.id, updateData, { new: true });
    res.json(updatedBloodBank);

  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ msg: "Server error during profile update" });
  }
};


// Inventory

exports.addInventory = async (req, res) => {
  try {
    const { bloodGroup, quantity, donorId, expiryDate } = req.body;
    const bloodBankId = req.user.id;

    if (!expiryDate) {
      return res.status(400).json({ error: "Expiry date is required." });
    }

    const expiry = new Date(expiryDate);
    if (isNaN(expiry.getTime())) {
      return res.status(400).json({ error: "Invalid expiry date format." });
    }

    let expiredAt = null;
    const now = new Date();
    if (expiry < now) {
      expiredAt = now; // Automatically set expiredAt if the item is expired
    } else {
      expiredAt = expiry; // Set expiredAt to expiryDate if the item is not expired yet
    }

    const entries = [];
    for (let i = 0; i < quantity; i++) {
      entries.push({
        bloodBankId,
        bloodGroup,
        quantity: 1,
        donorId: donorId || null,
        expiryDate: expiry,
        expiredAt: expiredAt,
      });
    }

    const saved = await Inventory.insertMany(entries);
    res.status(201).json({
      message: `${saved.length} inventory units added successfully.`,
      inventory: saved,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while adding inventory." });
  }
};




//=====================
//*BULK ADD INVENTORY*//
//======================
exports.bulkUploadInventory = async (req, res) => {
  try {
    const fileUrl = req.file?.path;
    if (!fileUrl) {
      return res.status(400).json({ error: "File upload failed." });
    }

    const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
    const workbook = xlsx.read(response.data, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    const bloodBankId = req.user.id;
    const validBloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
    const errors = [];
    const entries = [];

    for (let i = 0; i < data.length; i++) {
      let { bloodGroup, quantity, expiryDate, donorId } = data[i];

      bloodGroup = bloodGroup?.trim(); 

      if (!bloodGroup || quantity == null || !expiryDate) {
        errors.push({ row: i + 2, error: "Missing required fields" });
        continue;
      }

      if (!validBloodGroups.includes(bloodGroup)) {
        errors.push({ row: i + 2, error: "Invalid blood group" });
        continue;
      }

      quantity = Number(quantity); // ✅ Ensure quantity is a number
      if (isNaN(quantity) || quantity <= 0) {
        errors.push({ row: i + 2, error: "Invalid quantity" });
        continue;
      }

      // Convert Excel serial number to date if needed
      if (typeof expiryDate === 'number') {
        expiryDate = new Date(Math.round((expiryDate - 25569) * 86400 * 1000)); // Convert Excel date
      }

      // Now parse the expiryDate string correctly if it's not a number
      const expiry = new Date(expiryDate);
      if (isNaN(expiry.getTime())) {
        errors.push({ row: i + 2, error: "Invalid expiry date format" });
        continue;
      }

      let expiredAt = null;
      const now = new Date();
      if (expiry < now) {
        expiredAt = now; // Automatically set expiredAt if the item is expired
      } else {
        expiredAt = expiry; // Set expiredAt to expiryDate if the item is not expired yet
      }

      for (let j = 0; j < quantity; j++) {
        entries.push({
          bloodBankId,
          bloodGroup,
          quantity: 1,
          donorId: donorId || null,
          expiryDate: expiry,
          expiredAt: expiredAt,
        });
      }
    }

    if (entries.length > 0) {
      await Inventory.insertMany(entries);
    }

    res.status(200).json({
      message: "Bulk upload completed",
      inserted: entries.length,
      errors,
    });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: "Server error during upload" });
  }
};



exports.getInventorySummary = async (req, res) => {
  try {
    const bloodBankId = req.user.id;
    const inventory = await Inventory.aggregate([
      { $match: { bloodBankId: new mongoose.Types.ObjectId(bloodBankId), status: 'available' } },
      {
        $group: {
          _id: '$bloodGroup',
          totalUnits: { $sum: 1 },
          nearestExpiry: { $min: '$expiryDate' }
        }
      },
      { $sort: { nearestExpiry: 1 } }
    ]);

    res.status(200).json(inventory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while fetching inventory." });
  }
};


exports.getInventoryDetails = async (req, res) => {
  try {
    const bloodBankId = req.user.id;
    let { bloodGroup } = req.query;

    const filter = { bloodBankId, status: 'available' };

    if (bloodGroup) {
      bloodGroup = bloodGroup.replace(/ /g, "+"); // Convert spaces back to +
      filter.bloodGroup = bloodGroup;
    }

    const inventory = await Inventory.find(filter).sort({ expiryDate: 1 });

    res.status(200).json(inventory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while fetching details." });
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

