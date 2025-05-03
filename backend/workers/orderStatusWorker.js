const { Worker } = require('bullmq');
const connection = require('../utils/redisClient'); 
const Order = require('../models/patientModel/Order');
const Inventory = require('../models/BloodBankModel/Inventory');
const createNotification = require('../controllers/NotificationController/notificationController');

// // ✅ Fix: pass correct options to Redis
// const redisOptions = {
//   maxRetriesPerRequest: null,
// };

// const connection = new Redis(redisOptions);

const orderStatusWorker = new Worker(
  'order-status',
  async (job) => {
    const { orderId } = job.data;

    const order = await Order.findById(orderId);
    if (!order || order.status !== 'pending') return;

    // ✅ Auto-reject order
    order.status = 'rejected';
    await order.save();

    // ✅ Release reserved units
    await Inventory.updateMany(
      { _id: { $in: order.reservedUnits }, status: 'reserved' },
      { $set: { status: 'available' } }
    );

    // ✅ Notify patient
    await createNotification(order.patient, 'Patient', 'Your order was auto-rejected after 24 hours of inactivity.');
  },
  { connection }
);

console.log('🛠️ orderStatusWorker started...');
module.exports = orderStatusWorker;
