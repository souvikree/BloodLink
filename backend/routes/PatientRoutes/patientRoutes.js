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
const {
  searchBloodBanks
} = require('../../controllers/OrderController/searchBloodBanks.js');
const { protect } = require('../../middleware/PatientMiddleware/authMiddlewares.js');
const { addAddressAfterRegistration } = require('../../controllers/PatientController/addAddressAfterRegistration.js');
const { uploadPrescription } = require("../../middleware/BloodBankMiddleware/upload");


const router = express.Router();

router.post('/signup', registerPatient);
router.post('/login', loginPatient);

router.post('/add-address', protect, addAddressAfterRegistration);

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

router.get('/search', protect, searchNearby);
router.get('/search-banks', searchBloodBanks);
router.post('/place-order', protect, uploadPrescription.single('prescription'), placeOrder);
router.get('/orders/history', protect, getOrderHistory);

module.exports = router;
