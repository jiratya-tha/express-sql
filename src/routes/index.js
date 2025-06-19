const express = require('express');
const router = express.Router();
const userRoutes = require('./user.routes');

// Basic route
router.get('/', (req, res) => {
    res.json({ message: 'Welcome auy yeye wtf' });
});

router.get('/nodemon', (req, res) => {
    res.json({ message: 'nodemon test' });
});


// Health check route
router.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
     data : 'Connected'
    });
});

// Example route with database connection
router.get('/test-db', async (req, res) => {
    try {
        const { pool, poolConnect } = require('../config/db.config');
        await poolConnect;
        const result = await pool.request().query('SELECT GETDATE() as currentTime');
        res.json({ 
            message: 'Database connection successful',
            data: result.recordset[0]
        });
    } catch (err) {
        console.error('Database test failed:', err);
        res.status(500).json({ 
            message: 'Database connection failed',
            error: err.message
        });
    }
});

// User routes
router.use('/users', userRoutes);

module.exports = router; 