const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');


require('./config/db'); 

const app = express();

// Middleware
app.use(cors());
app.use(helmet()); 
app.use(morgan('dev')); 
app.use(bodyParser.json()); 

app.get('/', (req, res) => {
    res.status(200).json({ message: "BloodLink Backend API is running!" });
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

module.exports = app;
