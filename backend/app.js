const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');

// Import your db configuration
require('./config/db'); // Assuming db.js is inside the config folder

const app = express();

// Middleware
app.use(cors());
app.use(helmet()); // For security headers
app.use(morgan('dev')); // For logging HTTP requests
app.use(bodyParser.json()); // Parse incoming requests with JSON payloads

// Test route to check if the server is running
app.get('/', (req, res) => {
    res.status(200).json({ message: "BloodLink Backend API is running!" });
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

module.exports = app;
