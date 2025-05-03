const { Queue } = require('bullmq');

const redisConnection = process.env.REDIS_URL
  ? { connection: { maxRetriesPerRequest: null, url: process.env.REDIS_URL } }
  : {
      connection: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
        maxRetriesPerRequest: null,
      },
    };

const orderStatusQueue = new Queue('order-status', redisConnection);

module.exports = orderStatusQueue;
