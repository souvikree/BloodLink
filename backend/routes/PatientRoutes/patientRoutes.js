const express = require('express');
const {
  registerPatient,
  verifyOtpForRegistration,
  addPatientDetails,
  loginSendOtp,
  loginVerifyOtp,
  getProfile,
  updateProfile,
  searchNearby,
} = require('../../controllers/PatientController/patientController.js');

// const { sendOtpToMobile, verifyOtp } = require('../../controllers/PatientController/otpController.js');
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
router.post('/verify-registration', verifyOtpForRegistration);
router.put('/complete-profile', protect, addPatientDetails);

router.post('/login/send-otp', loginSendOtp);
router.post('/login/verify-otp', loginVerifyOtp);


router.get('/profile', protect, getProfile);

router.get('/search', protect, searchNearby);
router.get('/search-banks', searchBloodBanks);
router.post('/place-order', protect, uploadPrescription.single('prescription'), placeOrder);
router.get('/orders/history', protect, getOrderHistory);

module.exports = router;

// router.post('/add-address', protect, addAddressAfterRegistration);
// router.put('/profile', protect, updateProfile);