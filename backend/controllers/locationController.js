// //Handles location-based functionalities (finding blood banks, donors, etc.)
// const axios = require('axios');
// const BloodBank = require('../models/BloodBank');

// // Function to get the distance from Google Maps API
// const getDistanceOnRoad = async (start, goal) => {
//     const apiKey = process.env.GOOGLE_MAPS_API_KEY; // Store your API key in an environment variable
//     const url = `https://roads.googleapis.com/v1/snapToRoads?path=${start[1]},${start[0]}|${goal[1]},${goal[0]}&key=${apiKey}`;

//     try {
//         const response = await axios.get(url);
//         const snappedPoints = response.data.snappedPoints;

//         // Check if we received valid points
//         if (snappedPoints.length < 2) {
//             throw new Error('Could not find a valid road path.');
//         }

//         // Get the total distance
//         const totalDistance = snappedPoints.reduce((total, point, index) => {
//             if (index === snappedPoints.length - 1) return total; // Skip the last point
//             const nextPoint = snappedPoints[index + 1].location;
//             const distance = getDistance(snappedPoints[index].location, nextPoint);
//             return total + distance;
//         }, 0);

//         return totalDistance; // Distance in meters
//     } catch (error) {
//         console.error("Error fetching distance from Google Maps:", error);
//         throw new Error('Error calculating distance on road.');
//     }
// };

// // Function to calculate distance between two points using the Haversine formula
// const getDistance = (pointA, pointB) => {
//     const R = 6371e3; // Earth's radius in meters
//     const lat1 = pointA.latitude * Math.PI / 180;
//     const lat2 = pointB.latitude * Math.PI / 180;
//     const deltaLat = (pointB.latitude - pointA.latitude) * Math.PI / 180;
//     const deltaLon = (pointB.longitude - pointA.longitude) * Math.PI / 180;

//     const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
//               Math.cos(lat1) * Math.cos(lat2) *
//               Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c; // Distance in meters
// };

// // Function to find blood banks within a specified radius and matching blood type
// const findBloodBanks = async (req, res) => {
//     const { latitude, longitude, bloodType } = req.body;

//     try {
//         // Initial search with 7 km radius
//         let radius = 7 / 6378.1; // Convert km to radians for MongoDB
//         let bloodBanks = await BloodBank.find({
//             location: {
//                 $geoWithin: {
//                     $centerSphere: [[longitude, latitude], radius]
//                 }
//             },
//             bloodType: bloodType
//         });

//         // If no blood banks found, increase the radius by 3 km
//         if (bloodBanks.length === 0) {
//             radius = 10 / 6378.1; // Convert 10 km to radians
//             bloodBanks = await BloodBank.find({
//                 location: {
//                     $geoWithin: {
//                         $centerSphere: [[longitude, latitude], radius]
//                     }
//                 },
//                 bloodType: bloodType
//             });
//         }

//         if (bloodBanks.length === 0) {
//             return res.status(404).json({ message: 'No blood banks found within the specified radius.' });
//         }

//         // Calculate distances using Google Maps Roads API
//         const userLocation = [longitude, latitude];
//         const bloodBanksWithDistances = await Promise.all(bloodBanks.map(async (bloodBank) => {
//             const bankLocation = bloodBank.location.coordinates; // Assuming coordinates are [longitude, latitude]
//             const distance = await getDistanceOnRoad(userLocation, bankLocation);
//             return { ...bloodBank._doc, distance };
//         }));

//         // Sort blood banks by distance in ascending order
//         bloodBanksWithDistances.sort((a, b) => a.distance - b.distance);

//         // Respond with sorted blood banks
//         res.status(200).json(bloodBanksWithDistances);
//     } catch (error) {
//         console.error("Error finding blood banks:", error);
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

// module.exports = {
//     findBloodBanks,
// };
