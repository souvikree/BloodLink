const axios = require('axios');

const geocodeAddress = async (address) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);

        // Check if results are present in the response
        if (response.data.results && response.data.results.length > 0) {
            const location = response.data.results[0].geometry.location;
            return [location.lng, location.lat]; // return [longitude, latitude]
        } else {
            // Handle no results found
            throw new Error('No geocoding results found for the address');
        }
    } catch (error) {
        console.error("Error geocoding address:", error.message);
        throw new Error('Failed to geocode address');
    }
};

module.exports = geocodeAddress;
