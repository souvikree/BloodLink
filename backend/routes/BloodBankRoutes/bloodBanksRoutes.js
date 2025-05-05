const express = require("express");
const router = express.Router();
const controller = require("../../controllers/BloodBankController/bloodBankController");
const donorController = require("../../controllers/DonorController/donorController");
const { verifyToken } = require("../../middleware/BloodBankMiddleware/BloodBankMiddlewares");
const { requireRole } = require("../../middleware/BloodBankMiddleware/roleMiddleware");
const { uploadExcel, uploadLicense } = require("../../middleware/BloodBankMiddleware/upload");
// Auth
router.post("/register", controller.register);
router.post("/login", controller.login);

router.use(verifyToken); // <-- will apply only to routes below this
router.use(requireRole("bloodbank")); // also applies only below


router.get("/profile", controller.getProfile);
router.put("/profile", controller.updateProfile);

//upload license
router.post("/upload-license", uploadLicense.single("license"), controller.uploadLicense);

// Inventory
router.post("/inventory/add",controller.addInventory);


router.post("/inventory/bulk-upload", uploadExcel.single("file"), async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
  
      console.log("✅ Uploaded Excel File Info:", req.file);
  
      // You can send it back for quick testing:
      // return res.json({ file: req.file });
  
      // Or continue to your controller logic
      await controller.bulkUploadInventory(req, res, next);
    } catch (error) {
      console.error("❌ Upload Error:", error.message);
      res.status(500).json({ message: error.message });
    }
  });

router.get("/inventory/summary", controller.getInventorySummary);
router.get("/inventory/details", controller.getInventoryDetails);
  
router.post("/inventory/:inventoryId", controller.updateInventory);
router.get("/inventory", controller.getInventory);

// Orders
router.get("/orders", controller.getOrders);
router.put("/orders/:orderId", controller.updateOrderStatus);

// Donor routes (only BloodBank users can create and delete donors)
router.post("/donors", donorController.createDonor); // Create a new donor
router.get("/donors", donorController.getAllDonors); // List all donors
router.get("/donors/:id", donorController.getDonorById); // Get a single donor by ID
router.delete("/donors/:id", donorController.deleteDonor);




module.exports = router;
