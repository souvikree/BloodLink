// # Admin functionalities
const Admin = require('../models/Admin');
const asyncHandler = require('express-async-handler');

const getAllAdmins = asyncHandler(async (req, res) => {
    const admins = await Admin.find();
    res.json(admins);
});

const getAdminById = asyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.params.id);
    if (admin) {
        res.json(admin);
    } else {
        res.status(404).json({ message: 'Admin not found' });
    }
});

const updateAdminRole = asyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.params.id);
    if (admin) {
        admin.role = req.body.role || admin.role;
        const updatedAdmin = await admin.save();
        res.json(updatedAdmin);
    } else {
        res.status(404).json({ message: 'Admin not found' });
    }
});

const deleteAdmin = asyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.params.id);
    if (admin) {
        await admin.remove();
        res.json({ message: 'Admin removed' });
    } else {
        res.status(404).json({ message: 'Admin not found' });
    }
});

module.exports = {
    getAllAdmins,
    getAdminById,
    updateAdminRole,
    deleteAdmin,
};
