const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserController {
    // Create a new user
    static async register(req, res) {
        try {
            const { username, email, password } = req.body;

            // Validate input
            if (!username || !email || !password) {
                return res.status(400).json({
                    message: 'Please provide username, email and password'
                });
            }

            // Check if user already exists
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({
                    message: 'User with this email already exists'
                });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user
            const user = await User.create({
                username,
                email,
                password: hashedPassword
            });

            // Remove password from response
            const { password: _, ...userWithoutPassword } = user;

            // Generate JWT token
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            res.status(201).json({
                message: 'User created successfully',
                data: userWithoutPassword,
                token
            });
        } catch (err) {
            console.error('Error in register:', err);
            res.status(500).json({
                message: 'Error creating user',
                error: process.env.NODE_ENV === 'development' ? err.message : undefined
            });
        }
    }

    // Login user
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            // Validate input
            if (!email || !password) {
                return res.status(400).json({
                    message: 'Please provide email and password'
                });
            }

            // Find user
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({
                    message: 'Invalid credentials'
                });
            }

            // Check password
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({
                    message: 'Invalid credentials'
                });
            }

            // Remove password from response
            const { password: _, ...userWithoutPassword } = user;

            // Generate JWT token
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            res.json({
                message: 'Login successful',
                data: userWithoutPassword,
                token
            });
        } catch (err) {
            console.error('Error in login:', err);
            res.status(500).json({
                message: 'Error during login',
                error: process.env.NODE_ENV === 'development' ? err.message : undefined
            });
        }
    }

    // Get user profile
    static async getProfile(req, res) {
        try {
            // Use authenticated user's ID from JWT token
            const userId = req.user.id;
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            // Remove password from response
            const { password: _, ...userWithoutPassword } = user;

            res.json({
                message: 'Profile retrieved successfully',
                data: userWithoutPassword
            });
        } catch (err) {
            console.error('Error getting profile:', err);
            res.status(500).json({
                message: 'Error getting user profile',
                error: process.env.NODE_ENV === 'development' ? err.message : undefined
            });
        }
    }

    // Update user profile
    static async updateProfile(req, res) {
        try {
            // Use authenticated user's ID from JWT token
            const userId = req.user.id;
            const { username, email, password } = req.body;

            // Check if user exists
            const existingUser = await User.findById(userId);
            if (!existingUser) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            // Hash new password if provided
            let hashedPassword = existingUser.password;
            if (password) {
                hashedPassword = await bcrypt.hash(password, 10);
            }

            // Update user
            const updatedUser = await User.update(userId, {
                username: username || existingUser.username,
                email: email || existingUser.email,
                password: hashedPassword
            });

            // Remove password from response
            const { password: _, ...userWithoutPassword } = updatedUser;

            res.json({
                message: 'Profile updated successfully',
                data: userWithoutPassword
            });
        } catch (err) {
            console.error('Error updating profile:', err);
            res.status(500).json({
                message: 'Error updating user profile',
                error: process.env.NODE_ENV === 'development' ? err.message : undefined
            });
        }
    }

    // Delete user
    static async deleteUser(req, res) {
        try {
            // Use authenticated user's ID from JWT token
            const userId = req.user.id;
            const deleted = await User.delete(userId);

            if (!deleted) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            res.json({
                message: 'User deleted successfully'
            });
        } catch (err) {
            console.error('Error deleting user:', err);
            res.status(500).json({
                message: 'Error deleting user',
                error: process.env.NODE_ENV === 'development' ? err.message : undefined
            });
        }
    }

    static async getAllUsers(req, res) {
        try {
            const users = await User.findAll();
            res.json({
                message: 'Users retrieved successfully',
                data: users
            });
        } catch (err) {
            console.error('Error getting all users:', err);
            res.status(500).json({
                message: 'Error getting all users',
                error: process.env.NODE_ENV === 'development' ? err.message : undefined
            });
        }
    }
}

module.exports = UserController; 