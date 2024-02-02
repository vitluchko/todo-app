export default (): Record<string, any> => ({
    dbUsername: 'root',
    dbPassword: 'Clown228',
    dbHost: 'localhost',
    dbPort: 3306,
    dbName: 'todo-app',
});

console.log(parseInt(process.env.PORT))
console.log(process.env.DB_USER_NAME);
console.log(process.env.DB_USER_PASSWORD);
console.log(process.env.DB_HOST);
console.log(process.env.DB_PORT);
console.log(process.env.DB_NAME);
