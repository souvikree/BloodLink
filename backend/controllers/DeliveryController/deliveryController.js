const DeliveryPersonnel = require("../../models/DeliveryPersonnelModel/DeliveryPersonnel");
const Delivery = require("../../models/DeliveryModel/Delivery");

// Register
exports.register = async (req, res) => {
  const { name, email, password, phone, vehicle } = req.body;
  try {
    const existing = await DeliveryPersonnel.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const user = await DeliveryPersonnel.create({ name, email, password, phone, vehicle });
    res.status(201).json({ message: "Registered successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await DeliveryPersonnel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Profile
exports.getProfile = async (req, res) => {
  const user = await DeliveryPersonnel.findById(req.user.id);
  res.json(user);
};

// Update Profile
exports.updateProfile = async (req, res) => {
  const updates = req.body;
  const user = await DeliveryPersonnel.findByIdAndUpdate(req.user.id, updates, { new: true });
  res.json(user);
};

// Update Location
exports.updateLocation = async (req, res) => {
  const { lat, lng } = req.body;
  await DeliveryPersonnel.findByIdAndUpdate(req.user.id, {
    currentLocation: { type: "Point", coordinates: [lng, lat] },
  });
  res.json({ message: "Location updated" });
};

// Get Assigned Deliveries
exports.getDeliveries = async (req, res) => {
  const deliveries = await Delivery.find({ assignedTo: req.user.id }).populate("orderId");
  res.json(deliveries);
};

// Update Delivery Status
exports.updateDeliveryStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const delivery = await Delivery.findById(id);

  if (!delivery) return res.status(404).json({ message: "Delivery not found" });

  delivery.status = status;
  delivery.timestamps[status] = new Date();
  await delivery.save();

  res.json({ message: "Status updated", delivery });
};
