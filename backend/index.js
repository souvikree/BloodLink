const http = require('http');
const app = require('./app');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 5000; // You can configure the port in your .env file

const server = http.createServer(app);

// Starting the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
