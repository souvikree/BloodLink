//chatbotService.js

const Fuse = require('fuse.js');


const FAQ_RESPONSES = {
    1: {
        question: "Who is eligible to donate blood?",
        answer: "Anyone in good health, aged 17 or older (or as permitted by local laws), and weighing at least 110 pounds (50 kg) can typically donate blood. Please consult your local blood bank for specific guidelines.",
        keywords: ["eligible", "eligibility", "who can donate", "blood donation requirements", "donor criteria"]
    },
    2: {
        question: "How often can I donate blood?",
        answer: "You can donate whole blood every 56 days (about 8 weeks). For other types like platelets or plasma, the donation frequency may vary. Always follow medical advice before scheduling donations.",
        keywords: ["how often", "donate blood frequency", "how many times", "interval between donations", "donation gap", "give blood", "blood again after 2 months"]
    },
    3: {
        question: "How do I request blood through the platform?",
        answer: "Simply sign in to your account, search for available blood types near you, and place a blood request. Our team and blood banks will process it promptly to ensure timely delivery.",
        keywords: ["request blood", "how to order blood", "blood request process", "order blood", "blood booking"]
    },
    4: {
        question: "Can I cancel my blood request or order?",
        answer: "Yes, you can cancel your blood request through your dashboard before it has been dispatched. If already dispatched, please contact our support team immediately for assistance.",
        keywords: ["cancel blood order", "cancel request", "order cancellation", "how to cancel", "stop blood request"]
    },
    5: {
        question: "What should I do if I entered the wrong blood type while ordering?",
        answer: "Please cancel the incorrect order immediately and place a new request with the correct blood type. If you need urgent help, our support team is available to assist you.",
        keywords: ["wrong blood type", "incorrect blood request", "wrong order", "blood type mistake", "edit order"]
    },
    6: {
        question: "How does the platform manage blood inventory?",
        answer: "Our platform works closely with certified blood banks to update inventory levels in real-time. We ensure that only verified, safe, and available blood units are shown to users.",
        keywords: ["blood inventory", "manage inventory", "blood stock", "available blood", "blood management"]
    },
    7: {
        question: "Does blood expire if not used?",
        answer: "Yes, blood components have expiration periods. For example, red blood cells can typically be stored for up to 42 days. Our system ensures expired blood is automatically removed from inventory.",
        keywords: ["blood expiry", "blood expiration", "how long blood lasts", "expired blood", "blood storage"]
    },
    8: {
        question: "Is there a delivery tracking option for blood orders?",
        answer: "Yes, once your blood order is confirmed and dispatched, you can track the delivery status live from your dashboard. We'll also notify you of key updates along the way.",
        keywords: ["track blood order", "order status", "delivery tracking", "blood delivery", "track my request"]
    },
    9: {
        question: "What safety measures are in place for donated blood?",
        answer: "All donated blood undergoes rigorous screening for infectious diseases and quality checks before being added to our inventory. We strictly adhere to national and international safety standards.",
        keywords: ["blood safety", "donated blood testing", "screening", "blood quality", "safe blood donation"]
    },
    10: {
        question: "I need urgent blood. How fast can I get it?",
        answer: "We prioritize urgent blood requests. Depending on your location and blood availability, deliveries can be processed in as little as a few hours. Please mention 'urgent' in your request if needed.",
        keywords: ["urgent blood", "emergency blood", "how fast blood", "need blood now", "urgent request"]
    },
    11: {
        question: "Can blood banks update their inventory manually?",
        answer: "Yes, authorized blood banks can update their inventory manually through their dedicated dashboard. Our system also supports automatic updates to reflect real-time stock changes.",
        keywords: ["update inventory", "blood bank dashboard", "manual stock update", "inventory management", "blood bank portal"]
    },
    12: {
        question: "What should I do if I don't find the required blood type?",
        answer: "If the needed blood type is not available, please submit a special request. Our team will immediately start reaching out to nearby banks and donors to assist you as quickly as possible.",
        keywords: ["blood type not found", "unavailable blood", "special request", "can't find blood", "out of stock"]
    },
    13: {
        question: "How can I become a registered blood donor?",
        answer: "You can register as a blood donor directly through our platform by completing your profile, verifying your eligibility, and setting your preferred donation schedule. We'd love to have you onboard!",
        keywords: ["register donor", "become blood donor", "donor registration", "sign up to donate", "how to donate"]
    },
    14: {
        question: "Is there any cost for requesting blood?",
        answer: "The platform itself does not charge for placing a blood request. However, service or handling charges may apply depending on the blood bank or hospital you are ordering from.",
        keywords: ["cost of blood", "blood request charges", "any fees", "payment for blood", "blood request cost"]
    },
    15: {
        question: "How can I contact support if I face an issue?",
        answer: "Our support team is here for you! Please reach out to us through the Help Center in your dashboard or email us at support@bloodlink.com. We usually respond within a few hours.",
        keywords: ["contact support", "help center", "support email", "issue contact", "need help"]
    }
};

const faqList = Object.values(FAQ_RESPONSES);

const fuse = new Fuse(faqList, {
    keys: ['keywords', 'question', 'answer'],
    threshold: 0.5, // Adjust if needed
});

/**
 * Finds the best matching FAQ based on user input.
 * @param {string} userMessage
 * @returns {object}
 */
async function findBestFAQ(userMessage) {
    if (!userMessage) {
        return {
            question: "Invalid Input",
            answer: "Please enter a valid query."
        };
    }

    const result = fuse.search(userMessage);

    if (result.length > 0) {
        return result[0].item;
    }

    return {
        question: "No matching FAQ found",
        answer: "We're sorry, we couldn't find a matching answer. Please contact support for assistance."
    };
}

/**
 * Generates a chatbot response.
 * @param {string} message
 * @returns {Promise<string>}
 */
exports.generateResponse = async (message) => {
    const faq = await findBestFAQ(message);
    return faq.answer;
};