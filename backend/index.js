const { server } = require('./app'); 
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 5001;

// Starting the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
