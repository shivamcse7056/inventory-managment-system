const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, refreshUserToken, logoutUser } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refreshUserToken);
router.post('/logout', logoutUser);
router.get('/profile', protect, getUserProfile);

module.exports = router;
