// //Routes for location services (finding blood banks, donors, etc.)
// const express = require('express');
// const { findBloodBanks } = require('../controllers/locationController');
// const { protect } = require('../middleware/authMiddleware');

// const router = express.Router();

// // Protect all location routes
// router.use(protect);

// // Route to find blood banks based on user's location and blood type
// router.route('/find').post(findBloodBanks); // POST method to find blood banks

// module.exports = router;
