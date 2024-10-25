const express = require('express');
const { getAllAdmins, getAdminById, updateAdminRole, deleteAdmin } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all admin routes
router.use(protect);
router.use(admin);

router.route('/').get(getAllAdmins); // Get all admins
router.route('/:id').get(getAdminById).put(updateAdminRole).delete(deleteAdmin); // Get, update, or delete admin by ID

module.exports = router;
