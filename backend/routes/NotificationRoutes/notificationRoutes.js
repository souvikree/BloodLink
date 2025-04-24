const express = require('express');
const { getNotifications, markAsRead } = require('../../controllers/NotificationController/notificationController');
const { protect } = require('../../middleware/PatientMiddleware/authMiddlewares'); // adjust if separate middleware for blood bank

const router = express.Router();

router.get('/notifications', protect, getNotifications);
router.put('/:id/read', protect, markAsRead);

module.exports = router;
