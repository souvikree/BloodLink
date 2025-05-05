const express = require("express");
const router = express.Router();
const controller = require("../../controllers/Admin/adminController");
const { verifyAdminToken } = require("../../middleware/adminMiddleware/adminAuth");

// Auth
router.post("/login", controller.login);

// Protect everything below this middleware
router.use(verifyAdminToken);

// User Management
router.get("/users", controller.getAllUsers);
router.put("/users/:id/status", controller.updateUserStatus);
router.delete("/users/:id", controller.deleteUser);

// Order & Delivery
router.get("/orders", controller.getAllOrders);
router.put("/orders/assign", controller.assignDelivery);

// Dashboard
router.get("/dashboard", controller.getDashboardStats);

router.get("/pending-bloodbanks", controller.getPendingBloodBanks);
router.put("/approve-bloodbank/:id", controller.approveBloodBank);
router.delete("/reject-bloodbank/:id",controller.rejectBloodBank);


module.exports = router;
