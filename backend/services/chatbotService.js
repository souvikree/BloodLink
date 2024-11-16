//chatbotService.js
const FAQ_RESPONSES = {
    1: {
        question: "Who is eligible to donate blood?",
        answer: "Generally, individuals who are healthy, at least 17 years old, and weigh at least 110 pounds are eligible. However, eligibility may vary, so please consult local guidelines.",
        keywords: ["eligible", "donate blood", "requirements", "who can donate"]
    },
    2: {
        question: "How does BloodLink match donors with recipients?",
        answer: "BloodLink uses a compatibility algorithm that considers blood type, location, and urgency to match donors with those in need.",
        keywords: ["match", "donors", "recipients", "algorithm", "BloodLink"]
    },
    3: {
        question: "Where can I find nearby blood donation events?",
        answer: "You can find upcoming blood donation events on BloodLink's website under the 'Events' section.",
        keywords: ["nearby", "blood donation events", "events", "find donation"]
    },
    4: {
        question: "How can I register to donate blood?",
        answer: "Simply visit the BloodLink website, create an account, and follow the registration steps to become a donor.",
        keywords: ["register", "donate blood", "sign up", "become a donor"]
    },
    5: {
        question: "How is blood transported and stored safely?",
        answer: "Blood is stored at controlled temperatures and transported in specialized containers to ensure its safety and viability.",
        keywords: ["transported", "stored", "blood safety", "safe storage"]
    },
    6: {
        question: "Can I track the journey of my blood donation?",
        answer: "Yes! BloodLink offers a tracking feature so you can follow your donation's path and see when it reaches a recipient.",
        keywords: ["track", "journey", "donation", "track donation"]
    },
    7: {
        question: "How is my data used and protected on BloodLink?",
        answer: "Your data is securely stored and only used for matching you with donation opportunities. We follow strict data protection policies.",
        keywords: ["data", "used", "protected", "data security", "data usage"]
    },
    8: {
        question: "Does BloodLink share my information with anyone else?",
        answer: "No, your information is kept confidential and is not shared with third parties without your consent.",
        keywords: ["information", "share", "confidential", "third parties"]
    },
    9: {
        question: "Where can I find tips for staying healthy as a donor?",
        answer: "Check the 'Health Tips' section on BloodLink’s website for tips on staying healthy before and after donations.",
        keywords: ["tips", "staying healthy", "donor", "health tips"]
    },
    10: {
        question: "What should I do in case of an emergency blood requirement?",
        answer: "In case of an emergency, contact BloodLink support or check the app for urgent donation requests in your area.",
        keywords: ["emergency", "blood requirement", "urgent", "blood need"]
    }
};

function findFAQResponse(userMessage) {
    for (const key in FAQ_RESPONSES) {
        const faq = FAQ_RESPONSES[key];
        const match = faq.keywords.some(keyword => userMessage.toLowerCase().includes(keyword));
        if (match) return faq.answer;
    }
    return "I'm here to assist with your blood-related inquiries. How can I help?";
}

exports.generateResponse = (message) => {
    const faqResponse = findFAQResponse(message);
    return faqResponse;
};
