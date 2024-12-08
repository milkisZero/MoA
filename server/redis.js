const redis = require('redis');
const redisClient = redis.createClient({
    url: `[REDIS_URL]`,
});

redisClient.on('connect', () => {
    console.info('Redis connected!');
});
redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
});

(async () => {
    await redisClient.connect();
})();

module.exports = redisClient;