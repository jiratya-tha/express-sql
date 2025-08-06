const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Public routes (no authentication required)
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// Protected routes (authentication required)
router.get('/profile', authMiddleware, UserController.getProfile);
router.put('/profile', authMiddleware, UserController.updateProfile);
router.delete('/profile', authMiddleware, UserController.deleteUser);
router.get('/all', authMiddleware, UserController.getAllUsers);

module.exports = router; 