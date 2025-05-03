const Redis = require('ioredis');

let redis;

if (process.env.REDIS_URL) {
  // Use full URL in production (Render, Redis Cloud)
  redis = new Redis(process.env.REDIS_URL);
  console.log('✅ Using REDIS_URL for Redis connection');
} else {
  // Fallback for local development
  const host = process.env.REDIS_HOST || '127.0.0.1';
  const port = process.env.REDIS_PORT || 6379;
  redis = new Redis({
    host,
    port,
  });
  console.log(`✅ Using local Redis at ${host}:${port}`);
}

redis.on('connect', () => console.log('✅ Redis connected'));
redis.on('error', (err) => console.error('❌ Redis error:', err));

module.exports = redis;
