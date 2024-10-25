// # Authentication-related actions (login, signup)

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const Patient = require('../models/User');
const BloodBank = require('../models/BloodBank');
const Donor = require('../models/Donor');
const DeliveryPersonnel = require('../models/Delivery');
const Admin = require('../models/Admin');


const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// User login
const loginUser = asyncHandler(async (req, res) => {
    const { email, password, role } = req.body;
    let user;

    switch (role) {
        case 'patient':
            user = await Patient.findOne({ email });
            break;
        case 'bloodBank':
            user = await BloodBank.findOne({ email });
            break;
        case 'donor':
            user = await Donor.findOne({ email });
            break;
        case 'deliveryPersonnel':
            user = await DeliveryPersonnel.findOne({ email });
            break;
        case 'admin':
            user = await Admin.findOne({ email });
            break;
        default:
            return res.status(400).json({ message: 'Invalid role' });
    }

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user._id,
            role: role,
            token: generateToken(user._id, role),
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// User signup
const signupUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;
    let user;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    switch (role) {
        case 'patient':
            user = await Patient.create({ name, email, password: hashedPassword });
            break;
        case 'bloodBank':
            user = await BloodBank.create({ name, email, password: hashedPassword });
            break;
        case 'donor':
            user = await Donor.create({ name, email, password: hashedPassword });
            break;
        case 'deliveryPersonnel':
            user = await DeliveryPersonnel.create({ name, email, password: hashedPassword });
            break;
        case 'admin':
            user = await Admin.create({ name, email, password: hashedPassword });
            break;
        default:
            return res.status(400).json({ message: 'Invalid role' });
    }

    if (user) {
        res.status(201).json({
            _id: user._id,
            role: role,
            token: generateToken(user._id, role),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
});

module.exports = {
    loginUser,
    signupUser,
};
