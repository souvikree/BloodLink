const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const BloodBank = require("../../models/BloodBankModel/BloodBank");
const { getCoordinates } = require("../../utils/geocode");
const { updateInventory, getInventoryStats } = require("../../services/BloodBankService/inventoryService");
const { getOrdersByBank, updateOrderStatus } = require("../../services/OrderService/orderService");

// Register Blood Bank
exports.register = async (req, res) => {
  const { name, licenseId, email, password, contactNumber, address } = req.body;
  const existing = await BloodBank.findOne({ email });
  if (existing) return res.status(400).json({ msg: "Email already registered" });

  const hashed = await bcrypt.hash(password, 10);
  const coordinates = await getCoordinates(address);

  const bank = await BloodBank.create({
    name, licenseId, email, password: hashed, contactNumber, address,
    location: { type: "Point", coordinates }
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
exports.updateInventory = async (req, res) => {
  await updateInventory(req.user.id, req.body); // expects array [{bloodGroup, quantity}]
  res.json({ msg: "Inventory updated" });
};

exports.getInventory = async (req, res) => {
  const inv = await getInventoryStats(req.user.id);
  res.json(inv);
};

// Orders
exports.getOrders = async (req, res) => {
  const orders = await getOrdersByBank(req.user.id);
  res.json(orders);
};

exports.updateOrderStatus = async (req, res) => {
  const { orderId, status, pickupTime } = req.body;
  const updated = await updateOrderStatus(orderId, status, pickupTime);
  res.json(updated);
};
