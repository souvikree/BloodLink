const express = require("express");
const router = express.Router();
const controller = require("../../controllers/BloodBankController/bloodBankController");
const { verifyToken } = require("../../middleware/BloodBankMiddleware/BloodBankMiddlewares");
const { requireRole } = require("../../middleware/BloodBankMiddleware/roleMiddleware");

// Auth
router.post("/register", controller.register);
router.post("/login", controller.login);

// Protected routes
router.use(verifyToken, requireRole("bloodbank"));

router.get("/profile", controller.getProfile);
router.put("/profile", controller.updateProfile);

// Inventory
router.post("/inventory", controller.updateInventory);
router.get("/inventory", controller.getInventory);

// Orders
router.get("/orders", controller.getOrders);
router.put("/orders", controller.updateOrderStatus);

module.exports = router;
