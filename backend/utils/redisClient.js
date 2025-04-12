const Redis = require('ioredis');

// Use the full Redis URL if available (for both local and Render)
const redis = process.env.REDIS_URL 
  ? new Redis(process.env.REDIS_URL) 
  : new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1', // Use Redis container name or localhost for local development
      port: process.env.REDIS_PORT || 6379, // Default Redis port
    });

redis.on('connect', () => console.log('✅ Redis connected'));
redis.on('error', (err) => console.error('❌ Redis error:', err));

module.exports = redis;
