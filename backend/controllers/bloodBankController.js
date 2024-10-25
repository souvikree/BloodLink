const BloodBank = require('../models/BloodBank');
const asyncHandler = require('express-async-handler');

const getAllBloodBanks = asyncHandler(async (req, res) => {
    const bloodBanks = await BloodBank.find();
    res.json(bloodBanks);
});

const getBloodBankById = asyncHandler(async (req, res) => {
    const bloodBank = await BloodBank.findById(req.params.id);
    if (bloodBank) {
        res.json(bloodBank);
    } else {
        res.status(404).json({ message: 'Blood bank not found' });
    }
});

const updateBloodBank = asyncHandler(async (req, res) => {
    const bloodBank = await BloodBank.findById(req.params.id);
    if (bloodBank) {
        bloodBank.name = req.body.name || bloodBank.name;
        bloodBank.email = req.body.email || bloodBank.email;
        bloodBank.location = req.body.location || bloodBank.location;
        bloodBank.bloodInventory = req.body.bloodInventory || bloodBank.bloodInventory;

        const updatedBloodBank = await bloodBank.save();
        res.json(updatedBloodBank);
    } else {
        res.status(404).json({ message: 'Blood bank not found' });
    }
});

const deleteBloodBank = asyncHandler(async (req, res) => {
    const bloodBank = await BloodBank.findById(req.params.id);
    if (bloodBank) {
        await bloodBank.remove();
        res.json({ message: 'Blood bank removed' });
    } else {
        res.status(404).json({ message: 'Blood bank not found' });
    }
});

module.exports = {
    getAllBloodBanks,
    getBloodBankById,
    updateBloodBank,
    deleteBloodBank,
};
