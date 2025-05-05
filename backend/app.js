const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errorHandler, notFound } = require('./middleware/errorHandler');
require('dotenv').config();
const setupSocket = require('./config/socket');
const { setIO } = require('./jobs/expireInventoryJob');  

const chatbotRoutes = require('./routes/chatbotRoutes');
const patientRoutes = require('./routes/PatientRoutes/patientRoutes');
const bloodBanksRoutes = require('./routes/BloodBankRoutes/bloodBanksRoutes');
const adminRoutes = require('./routes/AdminRoutes/adminRoutes');
const notificationRoutes = require('./routes/NotificationRoutes/notificationRoutes');

// Connect to the database
require('./config/db');

const app = express();
const server = http.createServer(app);

// Setup socket.io
const io = setupSocket(server);

// Inject socket.io into app
app.set('io', io);

//Pass io to expireInventoryJob so cron jobs can send notifications
setIO(io);

//Start BullMQ background worker to auto-reject orders after 24 hours
require('./workers/orderStatusWorker');

// Middleware

app.use(cors({
    origin: ["http://localhost:8080", "https://bloodlink-dashboard.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }));
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use('/api', chatbotRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/bloodbanks', bloodBanksRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Test route
app.get('/', (req, res) => {
    res.status(200).json({ message: "BloodLink Backend API is running!" });
});

// Handle 404 errors
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

module.exports = { app, server }; // ✅ Export both app and server
