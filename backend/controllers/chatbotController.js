// controllers/chatbotController.js

const chatbotService = require('../services/chatbotService');

exports.chatbotResponse = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(400).json({ error: "Invalid input. 'message' must be a non-empty string." });
        }

        const reply = await chatbotService.generateResponse(message);
        console.log(`Chatbot received message: "${message}" | Responded with: "${reply}"`);

        res.status(200).json({ reply });
    } catch (error) {
        console.error("Error in chatbotResponse:", error.message);
        res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
};
