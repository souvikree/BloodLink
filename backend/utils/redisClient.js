const Redis = require('ioredis');

//use redis container
const redis = new Redis(process.env.REDIS_URL || {
  host: process.env.REDIS_HOST || 'redis',
  port: process.env.REDIS_PORT || 6379,
});

redis.on('connect', () => console.log('✅ Redis connected'));
redis.on('error', (err) => console.error('❌ Redis error:', err));

module.exports = redis;

