const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errorHandler, notFound } = require('./middleware/errorHandler'); // Adjust path as needed

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const bloodBankRoutes = require('./routes/bloodBankRoutes');
const donorRoutes = require('./routes/donorRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');


// Connect to the database
require('./config/db'); 

const app = express();

// Middleware
app.use(cors());
app.use(helmet()); 
app.use(morgan('dev')); 
app.use(bodyParser.json()); 

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/blood-banks', bloodBankRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Health check route
app.get('/', (req, res) => {
    res.status(200).json({ message: "BloodLink Backend API is running!" });
});

// Handle 404 errors
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
