const express = require('express');
const {
  registerPatient,
  loginPatient,
  getProfile,
  updateProfile,
  searchNearby,
} = require('../../controllers/PatientController/patientController.js');
const {
  placeOrder,
  getOrderHistory,
} = require('../../controllers/OrderController/orderController.js');
const { protect } = require('../../middleware/PatientMiddleware/authMiddlewares.js');

const router = express.Router();

router.post('/signup', registerPatient);
router.post('/login', loginPatient);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

router.get('/search', protect, searchNearby);
router.post('/order', protect, placeOrder);
router.get('/orders', protect, getOrderHistory);

module.exports = router;
