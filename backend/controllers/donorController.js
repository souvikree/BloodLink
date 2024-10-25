// # CRUD operations for donors
const Donor = require('../models/Donor');
const asyncHandler = require('express-async-handler');


const getAllDonors = asyncHandler(async (req, res) => {
    const donors = await Donor.find();
    res.json(donors);
});


const getDonorById = asyncHandler(async (req, res) => {
    const donor = await Donor.findById(req.params.id);
    if (donor) {
        res.json(donor);
    } else {
        res.status(404).json({ message: 'Donor not found' });
    }
});


const updateDonor = asyncHandler(async (req, res) => {
    const donor = await Donor.findById(req.params.id);
    if (donor) {
        donor.name = req.body.name || donor.name;
        donor.email = req.body.email || donor.email;
        donor.phone = req.body.phone || donor.phone;
        donor.location = req.body.location || donor.location;

        const updatedDonor = await donor.save();
        res.json(updatedDonor);
    } else {
        res.status(404).json({ message: 'Donor not found' });
    }
});


const deleteDonor = asyncHandler(async (req, res) => {
    const donor = await Donor.findById(req.params.id);
    if (donor) {
        await donor.remove();
        res.json({ message: 'Donor removed' });
    } else {
        res.status(404).json({ message: 'Donor not found' });
    }
});

module.exports = {
    getAllDonors,
    getDonorById,
    updateDonor,
    deleteDonor,
};
