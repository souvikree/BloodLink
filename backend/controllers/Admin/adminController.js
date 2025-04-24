const Patient = require("../../models/patientModel/Patient"); 
const Order = require("../../models/patientModel/Order");
const Delivery = require("../../models/DeliveryPersonnelModel/Delivery");
const BloodBank = require("../../models/BloodBankModel/BloodBank");
const Admin = require("../../models/AdminModel/admin");
const DeliveryPersonnel = require("../../models/DeliveryPersonnelModel/DeliveryPersonnel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ✅ Admin Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, admin: { email: admin.email, id: admin._id } });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//
// ✅ USER MANAGEMENT
//

// Get all non-admin users (patients, blood banks)
exports.getAllUsers = async (req, res) => {
  try {
    const patients = await Patient.find();
    const bloodBanks = await BloodBank.find();

    res.json({ patients, bloodBanks });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};

// Approve or deactivate account
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { model, isApproved } = req.body;

    let UserModel;
    if (model === "patient") UserModel = Patient;
    else if (model === "bloodBank") UserModel = BloodBank;
    else return res.status(400).json({ message: "Invalid model type" });

    await UserModel.findByIdAndUpdate(id, { isApproved });

    res.json({ message: `${model} approval status updated` });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user status", error: err.message });
  }
};

// Delete suspicious or fake user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { model } = req.body;

    let UserModel;
    if (model === "patient") UserModel = Patient;
    else if (model === "bloodBank") UserModel = BloodBank;
    else return res.status(400).json({ message: "Invalid model type" });

    await UserModel.findByIdAndDelete(id);

    res.json({ message: `${model} deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user", error: err.message });
  }
};

//
// ✅ ORDER & DELIVERY MANAGEMENT
//

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("patient")
      .populate("bloodBank")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
};

exports.getPendingBloodBanks = async (req, res) => {
    try {
      const pendingBloodBanks = await BloodBank.find({ isApproved: false });
      res.json(pendingBloodBanks);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch pending blood banks", error: err.message });
    }
  };

  
  exports.approveBloodBank = async (req, res) => {
    try {
      const { id } = req.params;
  
      const bloodBank = await BloodBank.findById(id);
      if (!bloodBank) {
        return res.status(404).json({ message: "Blood bank not found" });
      }
  
      if (!bloodBank.licenseDocumentUrl) {
        return res.status(400).json({ message: "No license document uploaded" });
      }
  
      bloodBank.isApproved = true;
      await bloodBank.save();
  
      res.json({ message: "Blood bank approved successfully", bloodBank });
    } catch (err) {
      res.status(500).json({ message: "Failed to approve blood bank", error: err.message });
    }
  };

  

  exports.rejectBloodBank = async (req, res) => {
    try {
      const { id } = req.params;
  
      const bloodBank = await BloodBank.findByIdAndDelete(id);
      if (!bloodBank) {
        return res.status(404).json({ message: "Blood bank not found" });
      }
  
      res.json({ message: "Blood bank rejected and deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to reject blood bank", error: err.message });
    }
  };
  

// Assign delivery personnel to order
exports.assignDelivery = async (req, res) => {
  try {
    const { orderId, deliveryPersonId } = req.body;

    const delivery = await Delivery.create({
      orderId,
      assignedTo: deliveryPersonId,
      status: "assigned",
      timestamps: { assigned: new Date() },
    });

    await DeliveryPersonnel.findByIdAndUpdate(deliveryPersonId, { isAvailable: false });

    res.json({ message: "Delivery assigned successfully", delivery });
  } catch (err) {
    res.status(500).json({ message: "Failed to assign delivery", error: err.message });
  }
};

//
// ✅ DASHBOARD STATS
//

exports.getDashboardStats = async (req, res) => {
  try {
    const totalPatients = await Patient.countDocuments();
    const totalBloodBanks = await BloodBank.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalDeliveries = await Delivery.countDocuments();

    // (Optional) Get most requested blood types
    const bloodDemand = await Order.aggregate([
      { $group: { _id: "$bloodType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      totalPatients,
      totalBloodBanks,
      totalOrders,
      totalDeliveries,
      mostRequestedBloodTypes: bloodDemand,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch dashboard stats", error: err.message });
  }
};
