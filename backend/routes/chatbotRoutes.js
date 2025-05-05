

// routes/chatbotRoutes.js

const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');

// Versioned API Route
router.post('/v1/chatbot/message', chatbotController.chatbotResponse);

module.exports = router;
