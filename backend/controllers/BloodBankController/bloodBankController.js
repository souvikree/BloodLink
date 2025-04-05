const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const xlsx = require("xlsx");
const fs = require("fs");

const BloodBank = require("../../models/BloodBankModel/BloodBank");
const Inventory = require("../../models/BloodBankModel/Inventory");
const { getCoordinates } = require("../../utils/geocode");
const { updateInventory, getInventoryStats } = require("../../services/BloodBankService/inventoryService");
// const { getOrdersByBank } = require("../../services/OrderService/orderService");

// Register Blood Bank
exports.register = async (req, res) => {
  const { name, licenseId, email, password, contactNumber, address } = req.body;
  const existing = await BloodBank.findOne({ email });
  if (existing) return res.status(400).json({ msg: "Email already registered" });

  const hashed = await bcrypt.hash(password, 10);
  // const coordinates = await getCoordinates(address);

  const bank = await BloodBank.create({
    name, licenseId, email, password: hashed, contactNumber, address
    // location: { type: "Point", coordinates }
  });

  res.status(201).json({ msg: "Registered. Awaiting approval." });
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
    const { bloodGroup, quantity, pricePerLiter } = req.body;
    const bloodBankId = req.user.id;

    // Check if this blood group is already added for this blood bank
    const existing = await Inventory.findOne({ bloodBankId, bloodGroup });
    if (existing) {
      return res.status(400).json({ message: "Blood group already exists in inventory." });
    }

    const inventory = new Inventory({
      bloodGroup,
      quantity,
      pricePerLiter,
      bloodBankId,
    });

    await inventory.save();

    res.status(201).json({
      message: "Inventory added successfully.",
      inventory,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//=====================
//*BULK ADD INVENTORY*//
//======================
exports.bulkUploadInventory = async (req, res) => {
  try {
    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    const bloodBankId = req.user.id;
    const validBloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
    const errors = [];
    let inserted = 0;
    let updated = 0;

    for (let i = 0; i < data.length; i++) {
      const { bloodGroup, quantity, pricePerLiter } = data[i];

      if (!bloodGroup || quantity == null || pricePerLiter == null) {
        errors.push({ row: i + 2, error: "Missing required fields" });
        continue;
      }

      if (!validBloodGroups.includes(bloodGroup)) {
        errors.push({ row: i + 2, error: "Invalid blood group" });
        continue;
      }

      const existing = await Inventory.findOne({ bloodBankId, bloodGroup });

      if (existing) {
        // 🔄 Update existing quantity and price
        existing.quantity += Number(quantity);
        existing.pricePerLiter = Number(pricePerLiter);
        await existing.save();
        updated++;
      } else {
        // ➕ Insert new entry
        await Inventory.create({
          bloodGroup,
          quantity: Number(quantity),
          pricePerLiter: Number(pricePerLiter),
          bloodBankId,
        });
        inserted++;
      }
    }

    fs.unlinkSync(filePath); // 🧹 Delete file after processing

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



// exports.updateInventory = async (req, res) => {
//   await updateInventory(req.user.id, req.body); // expects array [{bloodGroup, quantity}]
//   res.json({ msg: "Inventory updated" });
// };

exports.updateInventory = async (req, res) => {
  try {
    const { inventoryId } = req.params;
    const { quantity, pricePerLiter } = req.body;

    const inventory = await Inventory.findOneAndUpdate(
      { _id: inventoryId, bloodBankId: req.user.id },
      { quantity, pricePerLiter },
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
    const orders = await Order.find({ bloodBankId: req.user.id }).sort({ createdAt: -1 });
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
      { _id: orderId, bloodBankId: req.user.id },
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

