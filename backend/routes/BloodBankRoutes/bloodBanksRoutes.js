const express = require("express");
const router = express.Router();
const controller = require("../../controllers/BloodBankController/bloodBankController");
const { verifyToken } = require("../../middleware/BloodBankMiddleware/BloodBankMiddlewares");
const { requireRole } = require("../../middleware/BloodBankMiddleware/roleMiddleware");
const upload = require("../../middleware/BloodBankMiddleware/upload");
// Auth
router.post("/register", controller.register);
router.post("/login", controller.login);

router.use(verifyToken); // <-- will apply only to routes below this
router.use(requireRole("bloodbank")); // also applies only below


router.get("/profile", controller.getProfile);
router.put("/profile", controller.updateProfile);

// Inventory
router.post("/inventory/add",controller.addInventory);
router.post("/inventory/bulk-upload",upload.single("file"),controller.bulkUploadInventory);
router.post("/inventory/:inventoryId", controller.updateInventory);
router.get("/inventory", controller.getInventory);

// Orders
router.get("/orders", controller.getOrders);
router.put("/orders/:orderId", controller.updateOrderStatus);

module.exports = router;
