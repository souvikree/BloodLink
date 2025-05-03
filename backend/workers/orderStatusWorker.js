const { Worker } = require('bullmq');
const Order = require('../models/patientModel/Order');
const Inventory = require('../models/BloodBankModel/Inventory');
const createNotification = require('../controllers/NotificationController/notificationController');

const redisConnection = process.env.REDIS_URL
  ? { connection: { maxRetriesPerRequest: null, url: process.env.REDIS_URL } }
  : {
      connection: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
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
module.exports = orderStatusWorker;
