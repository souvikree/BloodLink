// /controllers/chatbotController.js

const chatbotService = require('../services/chatbotService');

exports.chatbotResponse = (req, res) => {
    const userMessage = req.body.message;
    const response = chatbotService.generateResponse(userMessage);
    res.json({ reply: response });
};
