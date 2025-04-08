// const jwt = require('jsonwebtoken');
// const asyncHandler = require('express-async-handler');
// const BloodBank = require('../models/BloodBank');
// const Donor = require('../models/Donor');
// const DeliveryPersonnel = require('../models/Delivery');
// const Admin = require('../models/Admin');
// const User = require('../models/User');


// const protect = asyncHandler(async (req, res, next) => {
//     let token;

//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//         try {
//             token = req.headers.authorization.split(' ')[1]; // Extract token from "Bearer <token>""
//             const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token

            
//             const role = decoded.role;  //role stored in the token 
//             let user;

//             switch (role) {
//                 case 'user':
//                     user = await User.findById(decoded.id).select('-password');
//                     break;
//                 case 'bloodBank':
//                     user = await BloodBank.findById(decoded.id).select('-password');
//                     break;
//                 case 'donor':
//                     user = await Donor.findById(decoded.id).select('-password');
//                     break;
//                 case 'deliveryPersonnel':
//                     user = await DeliveryPersonnel.findById(decoded.id).select('-password');
//                     break;
//                 case 'admin':
//                     user = await Admin.findById(decoded.id).select('-password');
//                     break;
//                 default:
//                     throw new Error('Invalid role');
//             }

//             if (!user) {
//                 res.status(401);
//                 throw new Error('User not found');
//             }

           
//             req.user = user;
//             next(); 
//         } catch (error) {
//             console.error(error);
//             res.status(401);
//             throw new Error('Not authorized, token failed');
//         }
//     }

//     if (!token) {
//         res.status(401);
//         throw new Error('Not authorized, no token');
//     }
// });

// // verify admin
// const admin = asyncHandler(async (req, res, next) => {
//     if (req.user && req.user instanceof Admin) {
//         next();
//     } else {
//         res.status(403);
//         throw new Error('Admin access only');
//     }
// });

// // Role-based middleware for patients
// const user = asyncHandler(async (req, res, next) => {
//     if (req.user && (req.user instanceof User || req.user instanceof Admin)) {
//         next();
//     } else {
//         res.status(403);
//         throw new Error('User access only');
//     }
// });

// // Role-based middleware for blood banks
// const bloodBank = asyncHandler(async (req, res, next) => {
//     if (req.user && (req.user instanceof BloodBank || req.user instanceof Admin)) {
//         next();
//     } else {
//         res.status(403);
//         throw new Error('Blood bank access only');
//     }
// });

// // Role-based middleware for donors
// const donor = asyncHandler(async (req, res, next) => {
//     if (req.user && req.user instanceof Donor) {
//         next();
//     } else {
//         res.status(403);
//         throw new Error('Donor access only');
//     }
// });

// // Role-based middleware for delivery personnel
// const deliveryPersonnel = asyncHandler(async (req, res, next) => {
//     if (req.user && req.user instanceof DeliveryPersonnel) {
//         next();
//     } else {
//         res.status(403);
//         throw new Error('Delivery personnel access only');
//     }
// });

// module.exports = {
//     protect,
//     admin,
//     user,
//     bloodBank,
//     donor,
//     deliveryPersonnel,
// };
