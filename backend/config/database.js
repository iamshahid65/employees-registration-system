const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'employee_registration',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    maxIdle: 10,
    idleTimeout: 60000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    timezone: 'Z'
});

// Test connection
const testConnection = async () => {
    try {
        const [rows] = await pool.execute('SELECT NOW() as current_time');
        console.log('✓ Database connected successfully:', rows[0].current_time);
    } catch (error) {
        console.error('✗ Database connection failed:', error.message);
    }
};

module.exports = { pool, testConnection };
