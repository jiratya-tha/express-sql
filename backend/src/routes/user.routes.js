const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');

// User routes
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/profile/:id', UserController.getProfile);
router.put('/profile/:id', UserController.updateProfile);
router.delete('/profile/:id', UserController.deleteUser);
router.get('/all', UserController.getAllUsers);

module.exports = router; 