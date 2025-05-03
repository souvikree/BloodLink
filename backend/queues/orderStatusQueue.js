const { Queue } = require('bullmq');
const connection = require('../utils/redisClient');

const orderStatusQueue = new Queue('order-status', {
  connection,
});

module.exports = orderStatusQueue;
