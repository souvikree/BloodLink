// # Order and delivery management
const Order = require('../models/Order');
const asyncHandler = require('express-async-handler');

// Get all orders
const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find().populate('user').populate('bloodBank').populate('delivery');
    res.json(orders);
});

const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user').populate('bloodBank').populate('delivery');
    if (order) {
        res.json(order);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
});

const createOrder = asyncHandler(async (req, res) => {
    const { user, bloodBank, bloodType, quantity, status } = req.body;
    const order = new Order({ user, bloodBank, bloodType, quantity, status });
    const newOrder = await order.save();
    res.status(201).json(newOrder);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        order.status = req.body.status || order.status;
        order.delivery = req.body.delivery || order.delivery;
        order.deliveryTime = req.body.deliveryTime || order.deliveryTime;

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
});

const deleteOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        await order.remove();
        res.json({ message: 'Order removed' });
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
});

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
    deleteOrder,
};
