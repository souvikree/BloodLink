// // # Authentication-related actions (login, signup)

// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const asyncHandler = require('express-async-handler');

// const BloodBank = require('../models/BloodBank');
// const Donor = require('../models/Donor');
// const DeliveryPersonnel = require('../models/Delivery');
// const Admin = require('../models/Admin');
// const User = require('../models/User');
// const geocodeAddress = require('../services/geoLocationService');

// const generateToken = (id, role) => {
//     return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
// };

// // User login
// const loginUser = asyncHandler(async (req, res) => {
//     const { email, password } = req.body;
//     let user;

//     try {

//         user = await User.findOne({ email }) ||
//                await BloodBank.findOne({ email }) ||
//                await Donor.findOne({ email }) ||
//                await DeliveryPersonnel.findOne({ email }) ||
//                await Admin.findOne({ email });

//         // console.log("Retrieved User:", user);

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Check if password exists in user object
//         if (!user.password) {
//             return res.status(500).json({ message: 'Password not set for user' });
//         }

//         console.log("User Password:", user.password); 
//         const isMatch = await bcrypt.compare(password, user.password);
//         console.log("Password Match:", isMatch); 

//         if (isMatch) {
           
//             const role = user.constructor.modelName.toLowerCase();

//             res.json({
//                 _id: user._id,
//                 role: role,
//                 token: generateToken(user._id, role),
//             });
//         } else {
//             res.status(401).json({ message: 'Invalid credentials' });
//         }
//     } catch (error) {
//         console.error("Error during login:", error);
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// });


// // User signup
// const signupUser = asyncHandler(async (req, res) => {
//     const { name, email, password, role, phone, bloodType, address } = req.body;  
   
//     const hashedPassword = await bcrypt.hash(password, 10);

//     switch (role) {
//         case 'user':
//             user = await User.create({ name, email, password: hashedPassword, phone });  
//             break;
//         case 'bloodBank':
//             // const bloodBankCoordinates = await geocodeAddress(address);
//             user = await BloodBank.create({
//                 name,
//                 email,
//                 password: hashedPassword,
//                 address,
//                 // location: { type: "Point", coordinates: bloodBankCoordinates },
//             });
//             break;
//         case 'donor':
//             user = await Donor.create({ name, email, password: hashedPassword, phone, bloodType }); //user = await Donor.create({ name, email, password: hashedPassword, phone, bloodType, location: { type: "Point", coordinates } });

//             break;
//         case 'deliveryPersonnel':
//             user = await DeliveryPersonnel.create({ name, email, password: hashedPassword, phone });
//             break;
//         case 'admin':
//             user = await Admin.create({ name, email, password: hashedPassword});
//             break;
//         default:
//             return res.status(400).json({ message: 'Invalid role' });
//     }

//     if (user) {
//         res.status(201).json({
//             _id: user._id,
//             role: role,
//             token: generateToken(user._id, role),
//         });
//     } else {
//         res.status(400).json({ message: 'Invalid user data' });
//     }
// });


// module.exports = {
//     loginUser,
//     signupUser,
// };
