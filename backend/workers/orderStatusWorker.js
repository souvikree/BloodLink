const { Worker } = require('bullmq');
const Order = require('../models/patientModel/Order');
const Inventory = require('../models/BloodBankModel/Inventory');
const createNotification = require('../controllers/NotificationController/notificationController');

const redisConnection = {
    connection: {
      url: process.env.QUEUE_REDIS_URL,
      maxRetriesPerRequest: null,
    },
  };

const orderStatusWorker = new Worker(
  'order-status',
  async (job) => {
    const { orderId } = job.data;

    const order = await Order.findById(orderId);
    if (!order || order.status !== 'pending') return;

    order.status = 'rejected';
    await order.save();

    await Inventory.updateMany(
      { _id: { $in: order.reservedUnits }, status: 'reserved' },
      { $set: { status: 'available' } }
    );

    await createNotification(
      order.patient,
      'Patient',
      'Your order was auto-rejected after 24 hours of inactivity.'
    );
  },
  redisConnection
  
);

console.log('🛠️ orderStatusWorker started...');
// console.log('Redis URL:', process.env.QUEUE_REDIS_URL);

module.exports = orderStatusWorker;
