const express = require('express');
const { getAllBloodBanks, getBloodBankById, updateBloodBank, deleteBloodBank, findBloodBanks } = require('../controllers/bloodBankController');
const { protect, bloodBank } = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all blood bank routes
router.use(protect);
router.use(bloodBank);

router.route('/all').get(getAllBloodBanks); 
router.route('/find').post(findBloodBanks);
router.route('/:id').get(getBloodBankById).put(updateBloodBank).delete(deleteBloodBank); // Get, update, or delete blood bank by ID

module.exports = router;
