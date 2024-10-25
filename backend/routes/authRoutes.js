const express = require('express');
const { loginUser, signupUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// User login
router.post('/login', loginUser);

// User signup
router.post('/signup', signupUser);

module.exports = router;
