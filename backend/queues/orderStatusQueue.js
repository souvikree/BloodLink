const { Queue } = require('bullmq');

const redisConnection = {
    connection: {
      url: process.env.REDIS_URL,
      maxRetriesPerRequest: null,
    },
  };

const orderStatusQueue = new Queue('order-status', redisConnection);

module.exports = orderStatusQueue;
