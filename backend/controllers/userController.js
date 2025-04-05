const User = require('../models/User');
const asyncHandler = require('express-async-handler');


const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find();
    res.json(users);
});


const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

const updateUser = asyncHandler(async (req, res) => {
    // Log the request body for debugging
    console.log(req.body);

    // Check if req.body exists and contains data
    if (!req.body) {
        return res.status(400).json({ message: "Request body is missing or empty" });
    }

    const user = await User.findById(req.params.id);
    if (user) {
        // Check if each field is provided in the request body, and update only if present
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        user.location = req.body.location || user.location;

        const updatedUser = await user.save();
        res.json(updatedUser);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});


const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        await User.deleteOne({ _id: req.params.id });  // Correct method to delete
        res.json({ message: 'User removed' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});


module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};
