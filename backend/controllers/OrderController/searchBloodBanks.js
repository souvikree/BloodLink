// controllers/PatientController.js

const Inventory = require('../../models/BloodBankModel/Inventory');

const searchBloodBanks = async (req, res) => {
  try {
    const { bloodGroup } = req.query;

    if (!bloodGroup) {
      return res.status(400).json({ message: "Blood group is required" });
    }

    const banks = await Inventory.find({
      bloodGroup,
      quantity: { $gt: 0 }
    }).populate("bloodBankId", "name address contactNumber");

    res.json(banks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { searchBloodBanks };
