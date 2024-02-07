export default (): Record<string, any> => ({
    redisHost: process.env.REDIS_HOST,
    redisPort: parseInt(process.env.REDIS_PORT, 10) || 6379,
    redisUser: process.env.REDIS_USER,
    redisPassword: process.env.REDIS_PASSWORD,
});
 