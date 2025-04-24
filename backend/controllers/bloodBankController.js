// const BloodBank = require('../models/BloodBank');
// const asyncHandler = require('express-async-handler');
// const axios = require('axios');
// const aStar= require('../utils/aStarAlgorithm');

// const getAllBloodBanks = asyncHandler(async (req, res) => {
//     const bloodBanks = await BloodBank.find();
//     res.json(bloodBanks);
// });

// const getBloodBankById = asyncHandler(async (req, res) => {
//     const bloodBank = await BloodBank.findById(req.params.id);
//     if (bloodBank) {
//         res.json(bloodBank);
//     } else {
//         res.status(404).json({ message: 'Blood bank not found' });
//     }
// });

// const updateBloodBank = asyncHandler(async (req, res) => {
//     const bloodBank = await BloodBank.findById(req.params.id);
//     if (bloodBank) {
//         bloodBank.name = req.body.name || bloodBank.name;
//         bloodBank.email = req.body.email || bloodBank.email;
//         bloodBank.location = req.body.location || bloodBank.location;
//         bloodBank.bloodInventory = req.body.bloodInventory || bloodBank.bloodInventory;

//         const updatedBloodBank = await bloodBank.save();
//         res.json(updatedBloodBank);
//     } else {
//         res.status(404).json({ message: 'Blood bank not found' });
//     }
// });

// const deleteBloodBank = asyncHandler(async (req, res) => {
//     const bloodBank = await BloodBank.findById(req.params.id);
//     if (bloodBank) {
//         await bloodBank.remove();
//         res.json({ message: 'Blood bank removed' });
//     } else {
//         res.status(404).json({ message: 'Blood bank not found' });
//     }
// });


// //------------find nearest blood bank------------------

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

//         // Prepare a graph representation for the A* algorithm
//         const graph = {}; // This should be built dynamically based on your blood banks and their connections

//         // Calculate distances using A* algorithm
//         const userLocation = { latitude, longitude };
//         const bloodBanksWithDistances = await Promise.all(bloodBanks.map(async (bloodBank) => {
//             const bankLocation = {
//                 latitude: bloodBank.location.coordinates[1],
//                 longitude: bloodBank.location.coordinates[0],
//             };
//             const path = aStar(userLocation, bankLocation, graph); // Use A* algorithm
//             const distance = await getDistanceOnRoad(userLocation, bankLocation); // You can choose to use the road distance or A* distance
//             return { ...bloodBank._doc, distance, path }; // Include the path for further use if needed
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
//     getAllBloodBanks,
//     getBloodBankById,
//     updateBloodBank,
//     deleteBloodBank,
//     findBloodBanks,
// };
