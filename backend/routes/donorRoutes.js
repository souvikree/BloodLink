// const express = require('express');
// const { getAllDonors, getDonorById, updateDonor, deleteDonor } = require('../controllers/donorController');
// const { protect, donor } = require('../middleware/authMiddleware');

// const router = express.Router();

// // Protect all donor routes
// router.use(protect);
// router.use(donor);

// router.route('/').get(getAllDonors); // Get all donors
// router.route('/:id').get(getDonorById).put(updateDonor).delete(deleteDonor); // Get, update, or delete donor by ID

// module.exports = router;
