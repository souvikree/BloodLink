const express = require('express');
const { getAllBloodBanks, getBloodBankById, updateBloodBank, deleteBloodBank } = require('../controllers/bloodBankController');
const { protect, bloodBank } = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all blood bank routes
router.use(protect);
router.use(bloodBank);

router.route('/').get(getAllBloodBanks); // Get all blood banks
router.route('/:id').get(getBloodBankById).put(updateBloodBank).delete(deleteBloodBank); // Get, update, or delete blood bank by ID

module.exports = router;
