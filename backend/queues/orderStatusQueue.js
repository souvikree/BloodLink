const { Queue } = require('bullmq');
const Redis = require('ioredis');

const connection = new Redis();

const orderStatusQueue = new Queue('order-status', {
  connection,
});

module.exports = orderStatusQueue;
