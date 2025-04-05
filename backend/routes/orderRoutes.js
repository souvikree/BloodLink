const express = require('express');
const { getAllOrders, getOrderById, createOrder, updateOrderStatus, deleteOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all order routes
router.use(protect);

router.route('/orders').get(getAllOrders).post(createOrder); // Get all orders or create a new order
router.route('/:id').get(getOrderById).put(updateOrderStatus).delete(deleteOrder); // Get, update, or delete order by ID

module.exports = router;
