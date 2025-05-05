const express = require("express");
const { query, validationResult } = require("express-validator");

const {
  registerPatient,
  verifyOtpForRegistration,
  addPatientDetails,
  loginSendOtp,
  loginVerifyOtp,
  getProfile,
  updateProfile,
  smartSearchBloodBanks,
} = require("../../controllers/PatientController/patientController.js");

// const { sendOtpToMobile, verifyOtp } = require('../../controllers/PatientController/otpController.js');
const {
  placeOrder,
  getOrderHistory,
  cancelOrder,
  getCharges,
} = require("../../controllers/OrderController/orderController.js");
const {
  searchBloodBanks,
} = require("../../controllers/OrderController/searchBloodBanks.js");
const {
  protect,
} = require("../../middleware/PatientMiddleware/authMiddlewares.js");
// const { addAddressAfterRegistration } = require('../../controllers/PatientController/addAddressAfterRegistration.js');
const {
  uploadPrescription,
} = require("../../middleware/BloodBankMiddleware/upload");

const bloodCompatibility = {
  "O-": ["O-"],
  "O+": ["O-", "O+"],
  "A-": ["O-", "A-"],
  "A+": ["O-", "O+", "A-", "A+"],
  "B-": ["O-", "B-"],
  "B+": ["O-", "O+", "B-", "B+"],
  "AB-": ["O-", "A-", "B-", "AB-"],
  "AB+": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
};

const router = express.Router();

router.post("/signup", registerPatient);
router.post("/verify-registration", verifyOtpForRegistration);
router.put("/complete-profile", protect, addPatientDetails);

router.post("/login/send-otp", loginSendOtp);
router.post("/login/verify-otp", loginVerifyOtp);

router.get("/profile", protect, getProfile);

router.get(
  "/search",
  protect,
  [
    query("latitude").exists().withMessage("Latitude is required").isFloat(),
    query("longitude").exists().withMessage("Longitude is required").isFloat(),
    query("bloodGroup")
      .exists()
      .withMessage("Blood group is required")
      .customSanitizer(value => value.replace(/ /g, "+").trim())
      .isString()
      .isIn(Object.keys(bloodCompatibility))
      .withMessage("Invalid blood group"),
  ],
  smartSearchBloodBanks
);
router.get("/search-banks", searchBloodBanks);

router.get("/charges/:bloodType", protect, getCharges);
router.post(
  "/place-order",
  protect,
  uploadPrescription.single("prescription"),
  placeOrder
);
router.put("/orders/:orderId/cancel", protect, cancelOrder);
router.get("/orders/history", protect, getOrderHistory);

module.exports = router;
