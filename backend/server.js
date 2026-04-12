const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const employeeRoutes = require('./routes/employeeRoutes');
const { connectDB, testConnection, closePool } = require('./config/database');
const EmployeeModel = require('./models/employeeModel');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'production';

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${new Date().toISOString()} [${res.statusCode}] ${req.method} ${req.path} - ${duration}ms`);
    });
    next();
});

// Health check endpoint with DB connectivity info
app.get('/health', async (req, res) => {
    try {
        const dbStatus = await testConnection();
        res.status(200).json({ 
            status: 'OK',
            environment: NODE_ENV,
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            database: dbStatus ? 'connected' : 'disconnected'
        });
    } catch (error) {
        res.status(503).json({
            status: 'UNHEALTHY',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// API Routes
app.use('/api/employees', employeeRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.path
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', {
        message: err.message,
        stack: NODE_ENV === 'development' ? err.stack : undefined,
        path: req.path,
        method: req.method
    });
    
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        error: NODE_ENV === 'development' ? err : undefined
    });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(async () => {
        console.log('HTTP server closed');
        await closePool();
        process.exit(0);
    });
});

// Initialize database and start server
const startServer = async () => {
    try {
        console.log(`🚀 Starting Employee Registration Backend (${NODE_ENV})`);
        
        // Connect to database
        console.log('Connecting to database...');
        await connectDB();

        // Create tables
        console.log('Initializing database schema...');
        await EmployeeModel.createTable();

        // Start server
        const server = app.listen(PORT, '0.0.0.0', () => {
            console.log(`✓ Server running on port ${PORT}`);
            console.log(`✓ Environment: ${NODE_ENV}`);
            console.log(`✓ API base URL: http://0.0.0.0:${PORT}/api`);
            console.log(`✓ Health check: http://0.0.0.0:${PORT}/health`);
        });

        return server;
    } catch (error) {
        console.error('✗ Failed to start server:', error.message);
        process.exit(1);
    }
};

const server = startServer().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});

module.exports = app;
