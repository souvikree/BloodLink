const axios = require("axios");

exports.getCoordinates = async (address) => {
  const encoded = encodeURIComponent(address);
  const { data } = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=${process.env.GOOGLE_MAPS_API_KEY}`);
  const location = data.results[0].geometry.location;
  return [location.lng, location.lat]; // [lng, lat]
};
