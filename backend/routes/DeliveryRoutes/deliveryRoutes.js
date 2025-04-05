const express = require("express");
const router = express.Router();
const deliveryCtrl = require("../../controllers/DeliveryController/deliveryController");
const { authenticate } = require("../../middleware/DeliveryMiddileware/deliveryMiddlewares");
const { authorizeRole } = require("../../middleware/DeliveryMiddileware/deliveryroleMiddleware");

router.post("/register", deliveryCtrl.register);
router.post("/login", deliveryCtrl.login);

router.use(authenticate, authorizeRole("delivery"));
router.get("/profile", deliveryCtrl.getProfile);
router.put("/profile", deliveryCtrl.updateProfile);
router.put("/location", deliveryCtrl.updateLocation);
router.get("/deliveries", deliveryCtrl.getDeliveries);
router.put("/deliveries/:id/status", deliveryCtrl.updateDeliveryStatus);

module.exports = router;
