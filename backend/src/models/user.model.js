const { sql, pool, poolConnect } = require('../config/db.config');

class User {
    constructor(user) {
        this.id = user.user_id || user.id; // Handle both user_id (from DB) and id (from API)
        this.username = user.username;
        this.email = user.email;
        this.password = user.password;
        this.created_at = user.created_at;
        this.updated_at = user.updated_at;
    }

    static async createTable() {
        try {
            await poolConnect;
            const result = await pool.request().query(`
                IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' and xtype='U')
                CREATE TABLE users (
                    user_id INT IDENTITY(1,1) PRIMARY KEY,
                    username NVARCHAR(50) NOT NULL UNIQUE,
                    email NVARCHAR(100) NOT NULL UNIQUE,
                    password NVARCHAR(255) NOT NULL,
                    created_at DATETIME DEFAULT GETDATE(),
                    updated_at DATETIME DEFAULT GETDATE()
                )
            `);
            console.log('Users table created or already exists');
            return result;
        } catch (err) {
            console.error('Error creating users table:', err);
            throw err;
        }
    }

    static async create(newUser) {
        try {
            await poolConnect;
            const result = await pool.request()
                .input('username', sql.NVarChar, newUser.username)
                .input('email', sql.NVarChar, newUser.email)
                .input('password', sql.NVarChar, newUser.password)
                .query(`
                    INSERT INTO users (username, email, password)
                    OUTPUT INSERTED.*
                    VALUES (@username, @email, @password)
                `);
            return new User(result.recordset[0]);
        } catch (err) {
            console.error('Error creating user:', err);
            throw err;
        }
    }

    static async findById(id) {
        try {
            await poolConnect;
            const result = await pool.request()
                .input('id', sql.Int, id)
                .query('SELECT * FROM users WHERE user_id = @id');
            return result.recordset[0] ? new User(result.recordset[0]) : null;
        } catch (err) {
            console.error('Error finding user:', err);
            throw err;
        }
    }

    static async findByEmail(email) {
        try {
            await poolConnect;
            const result = await pool.request()
                .input('email', sql.NVarChar, email)
                .query('SELECT * FROM users WHERE email = @email');
            return result.recordset[0] ? new User(result.recordset[0]) : null;
        } catch (err) {
            console.error('Error finding user by email:', err);
            throw err;
        }
    }
    static async findAll() {
        try {
            await poolConnect;
            const result = await pool.request().query('SELECT user_id, username, email FROM users');
            return result.recordset.map(user => new User(user));
        } catch (err) {
            console.error('Error finding all users:', err);
            throw err;
        }
    }

    static async update(id, userData) {
        try {
            await poolConnect;
            const result = await pool.request()
                .input('id', sql.Int, id)
                .input('username', sql.NVarChar, userData.username)
                .input('email', sql.NVarChar, userData.email)
                .input('password', sql.NVarChar, userData.password)
                .query(`
                    UPDATE users 
                    SET username = @username,
                        email = @email,
                        password = @password,
                        updated_at = GETDATE()
                    OUTPUT INSERTED.*
                    WHERE user_id = @id
                `);
            return result.recordset[0] ? new User(result.recordset[0]) : null;
        } catch (err) {
            console.error('Error updating user:', err);
            throw err;
        }
    }



    static async delete(id) {
        try {
            await poolConnect;
            const result = await pool.request()
                .input('id', sql.Int, id)
                .query('DELETE FROM users WHERE user_id = @id');
            return result.rowsAffected[0] > 0;
        } catch (err) {
            console.error('Error deleting user:', err);
            throw err;
        }
    }
}

// Create table when the model is loaded
User.createTable().catch(err => {
    console.error('Failed to create users table:', err);
});



module.exports = User; 