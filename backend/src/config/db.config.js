const sql = require('mssql');
require('dotenv').config();

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT),
    options: {
        encrypt: true,
        trustServerCertificate: true,
        enableArithAbort: true,
        requestTimeout: 60000,
        connectionTimeout: 60000,
        maxRetriesOnTransientErrors: 3
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

// Create a connection pool
const pool = new sql.ConnectionPool(dbConfig);

// Function to connect with retry
async function connectWithRetry(retries = 5, delay = 10000) {
    for (let i = 0; i < retries; i++) {
        try {
            console.log(`Attempting to connect to SQL Server (attempt ${i + 1}/${retries})...`);
            console.log(`Connection details: server=${dbConfig.server}, port=${dbConfig.port}, database=${dbConfig.database}`);
            
            await pool.connect();
            console.log(`Connected to SQL Server successfully on port ${dbConfig.port}!`);
            
            // Test the connection with a simple query
            const result = await pool.request().query('SELECT @@VERSION as version');
            console.log('SQL Server version:', result.recordset[0].version);
            
            return pool;
        } catch (err) {
            console.error(`Connection attempt ${i + 1} failed:`, err.message);
            if (i < retries - 1) {
                console.log(`Retrying in ${delay/1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                console.error('All connection attempts failed. Last error:', err);
                throw err;
            }
        }
    }
}

const poolConnect = connectWithRetry();

// Handle pool errors
pool.on('error', err => {
    console.error('Database pool error:', err);
});

module.exports = {
    sql,
    pool,
    poolConnect
}; 