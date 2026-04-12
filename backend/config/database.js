const sql = require('mssql');
require('dotenv').config();

const config = {
    server: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 1433,
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'employees_db',
    authentication: {
        type: 'default'
    },
    options: {
        encrypt: process.env.NODE_ENV === 'production', // Required for Azure SQL
        trustServerCertificate: process.env.NODE_ENV !== 'production',
        connectTimeout: 30000,
        requestTimeout: 30000,
        enableArithAbort: true
    },
    pool: {
        max: 10,
        min: 2,
        idleTimeoutMillis: 30000,
        acquireTimeoutMillis: 30000
    }
};

// Global pool instance
let connectionPool = null;

// Create connection pool
async function connectDB() {
    try {
        if (connectionPool && connectionPool.connected) {
            console.log('✓ SQL Server already connected');
            return connectionPool;
        }
        
        connectionPool = new sql.ConnectionPool(config);
        
        // Add event listeners
        connectionPool.on('error', err => {
            console.error('Connection pool error:', err);
        });
        
        await connectionPool.connect();
        console.log('✓ SQL Server connected successfully');
        return connectionPool;
    } catch (error) {
        console.error('✗ Database connection failed:', error.message);
        throw error;
    }
}

// Test connection
async function testConnection() {
    try {
        if (!connectionPool || !connectionPool.connected) {
            throw new Error('Pool not connected');
        }
        const request = connectionPool.request();
        await request.query('SELECT GETDATE() as currentDate');
        return true;
    } catch (error) {
        console.error('Connection test failed:', error.message);
        return false;
    }
}

// Get the pool
function getPool() {
    if (!connectionPool || !connectionPool.connected) {
        throw new Error('Database not connected. Call connectDB() first.');
    }
    return connectionPool;
}

// Execute query with proper MSSQL syntax
async function execute(sqlString, params = []) {
    try {
        const pool = getPool();
        const request = pool.request();
        
        if (params && Array.isArray(params)) {
            params.forEach((value, index) => {
                request.input(`param${index}`, value);
            });
        }
        
        const result = await request.query(sqlString);
        return result.recordset || [];
    } catch (error) {
        console.error('Query execution error:', error);
        throw error;
    }
}

// Graceful shutdown
async function closePool() {
    if (connectionPool) {
        await connectionPool.close();
        console.log('Database pool closed');
        connectionPool = null;
    }
}

module.exports = { 
    connectDB, 
    testConnection,
    getPool,
    execute, 
    sql,
    closePool
};

module.exports = { 
    connectDB, 
    testConnection,
    getPool,
    execute, 
    sql,
    closePool
};