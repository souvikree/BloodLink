const Donor = require("../../models/DonorModel/Donor");

// Create a new donor (only allowed by BloodBank)
exports.createDonor = async (req, res) => {
  try {
    const { name, age, gender, bloodGroup, contactNumber, address, email, lastDonationDate } = req.body;

    const newDonor = new Donor({
      bloodBankId: req.user.id, // Automatically assign the logged-in BloodBank as the creator
      name,
      age,
      gender,
      bloodGroup,
      contactNumber,
      address,
      email,
      lastDonationDate,
    });

    await newDonor.save();
    res.status(201).json(newDonor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while creating donor." });
  }
};

// Get all active donors
exports.getAllDonors = async (req, res) => {
  try {
    const donors = await Donor.find({ isActive: true }); // Only active donors
    res.status(200).json(donors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching donors." });
  }
};

// Get a single donor by ID
exports.getDonorById = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }
    res.status(200).json(donor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching donor." });
  }
};

// Soft delete a donor (set isActive to false)
exports.deleteDonor = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    donor.isActive = false;
    await donor.save();
    res.status(200).json({ message: "Donor has been soft-deleted." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while deleting donor." });
  }
};
