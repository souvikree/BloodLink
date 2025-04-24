const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errorHandler, notFound } = require('./middleware/errorHandler'); // Adjust path as needed
require('dotenv').config();
const setupSocket = require('./config/socket');


// Import routes
// const authRoutes = require('./routes/authRoutes');
// const userRoutes = require('./routes/userRoutes');
// const bloodBankRoutes = require('./routes/bloodBankRoutes');
// const donorRoutes = require('./routes/donorRoutes');
// const orderRoutes = require('./routes/orderRoutes');
// const adminRoutes = require('./routes/adminRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');



const patientRoutes = require('./routes/PatientRoutes/patientRoutes');
const bloodBanksRoutes = require('./routes/BloodBankRoutes/bloodBanksRoutes');
const adminRoutes = require('./routes/AdminRoutes/adminRoutes');
const notificationRoutes = require('./routes/NotificationRoutes/notificationRoutes');


// Connect to the database
require('./config/db'); 

const app = express();
const server = http.createServer(app);
const io = setupSocket(server);

// Middleware
app.use(cors());
app.use(helmet()); 
app.use(morgan('dev')); 
app.use(bodyParser.json()); 
app.use(express.json()); 
app.set('io', io);

app.use('/api/chatbot', chatbotRoutes);


app.use('/api/patients', patientRoutes);
app.use('/api/bloodbanks', bloodBanksRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ message: "BloodLink Backend API is running!" });
});

// Handle 404 errors
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

module.exports = app;

// Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/blood-banks', bloodBankRoutes);
// app.use('/api/donors', donorRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/admins', adminRoutes);