const cron = require('node-cron');
const Inventory = require('../models/BloodBankModel/Inventory');
const { createNotification } = require('../controllers/NotificationController/notificationController');

let ioInstance;
function setIO(io) {
  ioInstance = io;
}

// Run every hour (to ensure timely updates)
// (You can also run every 30 min or midnight — depends on your requirement)
cron.schedule('0 * * * *', async () => {
    console.log('Running expired inventory marking job...');
  
    try {
      const now = new Date();
      now.setHours(0, 0, 0, 0); // 🛠️ Important fix
  
      const expiredInventories = await Inventory.find({
        expiryDate: { $lt: now },  // 🛠️ Only dates before today
        status: 'available'
      });
  
      if (expiredInventories.length === 0) {
        console.log('No expired inventory found.');
        return;
      }
  
      const expiredIds = expiredInventories.map(item => item._id);
  
      await Inventory.updateMany(
        { _id: { $in: expiredIds } },
        { $set: { status: 'expired', expiredAt: new Date() } }
      );
  
      for (const inventory of expiredInventories) {
        const userId = inventory.bloodBankId;
        const message = `Blood unit (${inventory.bloodGroup}) has expired and was removed from available stock. Date of expiry: ${inventory.expiryDate}`;
  
        if (ioInstance) {
          await createNotification(userId, 'BloodBank', message, ioInstance);
        }
      }
  
      console.log(`Marked ${expiredInventories.length} inventories as expired.`);
    } catch (err) {
      console.error('Error during inventory expiration process:', err);
    }
  });
  

module.exports = { setIO };
