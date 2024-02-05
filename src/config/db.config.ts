export default (): Record<string, any> => ({
    dbUsername: process.env.DB_USER_NAME,
    dbPassword: process.env.DB_USER_PASSWORD,
    dbHost: process.env.DB_HOST,
    dbPort: parseInt(process.env.DB_PORT, 10) || 3306,
    dbName: process.env.DB_NAME,
});
