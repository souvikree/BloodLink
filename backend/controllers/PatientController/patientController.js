const Patient = require("../../models/patientModel/Patient");
const { generateToken } = require("../../utils/jwt");
const redis = require("../../utils/redisClient");
const sendOtp = require("../../utils/twilio");
const { getCoordinates } = require("../../utils/geocode");
const BloodBank = require("../../models/BloodBankModel/BloodBank");
const Inventory = require("../../models/BloodBankModel/Inventory");

const { validationResult } = require("express-validator");

const RESEND_COOLDOWN = 60; // seconds

const registerPatient = async (req, res) => {
  const { name, mobile } = req.body;
  if (!name || !mobile)
    return res.status(400).json({ message: "Name and mobile are required" });

  const cooldownKey = `otp:cooldown:${mobile}`;
  const lastSent = await redis.get(cooldownKey);

  if (lastSent) {
    const secondsPassed = Math.floor((Date.now() - parseInt(lastSent)) / 1000);
    const secondsRemaining = RESEND_COOLDOWN - secondsPassed;
    if (secondsRemaining > 0) {
      return res.status(429).json({
        message: `Please wait ${secondsRemaining} seconds before requesting a new OTP.`,
        retryAfter: secondsRemaining,
      });
    }
  }

  let patient = await Patient.findOne({ mobile });

  if (!patient) {
    patient = await Patient.create({
      name,
      mobile,
      location: {
        type: "Point",
        coordinates: [0, 0],
      },
    });
  } else if (patient.isVerified) {
    return res.status(400).json({ message: "Mobile already registered" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await redis.setex(`otp:${mobile}`, 300, otp);
  await sendOtp(mobile, otp);

  // Set cooldown timestamp
  await redis.setex(cooldownKey, RESEND_COOLDOWN, Date.now().toString());

  res.status(200).json({ message: "OTP sent successfully" });
};

// 2. Verify OTP for Registration
const verifyOtpForRegistration = async (req, res) => {
  const { mobile, otp } = req.body;
  const otpKey = `otp:${mobile}`;
  const redisOtp = await redis.get(otpKey);

  if (!redisOtp || redisOtp !== otp) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  const patient = await Patient.findOne({ mobile });
  if (!patient) return res.status(404).json({ message: "Patient not found" });

  patient.isVerified = true;
  await patient.save();
  await redis.del(otpKey);

  res.status(200).json({
    message: "OTP verified. Registration complete.",
    token: generateToken(patient._id),
  });
};

const addPatientDetails = async (req, res) => {
  const { bloodGroup, address, medicalRecords } = req.body;

  const patient = await Patient.findById(req.user._id);
  if (!patient || !patient.isVerified) {
    return res
      .status(403)
      .json({ message: "Not allowed. Phone not verified." });
  }

  if (bloodGroup) patient.bloodGroup = bloodGroup;
  if (medicalRecords) patient.medicalRecords = medicalRecords;

  if (address) {
    const coordinates = await getCoordinates(address); // geocoding function
    patient.location = {
      type: "Point",
      coordinates,
    };
  }

  await patient.save();
  res.status(200).json({ message: "Details updated successfully", patient });
};

// 4. Login via OTP
const loginSendOtp = async (req, res) => {
  const { mobile } = req.body;
  const patient = await Patient.findOne({ mobile });

  if (!patient || !patient.isVerified) {
    return res.status(404).json({ message: "User not found or not verified" });
  }

  const cooldownKey = `otp:login:cooldown:${mobile}`;
  const lastSent = await redis.get(cooldownKey);

  if (lastSent) {
    const secondsPassed = Math.floor((Date.now() - parseInt(lastSent)) / 1000);
    const secondsRemaining = RESEND_COOLDOWN - secondsPassed;
    if (secondsRemaining > 0) {
      return res.status(429).json({
        message: `Please wait ${secondsRemaining} seconds before requesting a new OTP.`,
        retryAfter: secondsRemaining,
      });
    }
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await redis.setex(`otp:login:${mobile}`, 300, otp);
  await sendOtp(mobile, otp);

  await redis.setex(cooldownKey, RESEND_COOLDOWN, Date.now().toString());

  res.status(200).json({ message: "OTP sent for login" });
};

const loginVerifyOtp = async (req, res) => {
  const { mobile, otp } = req.body;
  const redisOtp = await redis.get(`otp:login:${mobile}`);

  if (!redisOtp || redisOtp !== otp) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  const patient = await Patient.findOne({ mobile });
  if (!patient) return res.status(404).json({ message: "User not found" });

  await redis.del(`otp:login:${mobile}`);

  res.status(200).json({
    message: "Login successful",
    token: generateToken(patient._id),
    name: patient.name,
  });
};
//PROFILE MANAGEMENT

const getProfile = async (req, res) => {
  const patient = await Patient.findById(req.user._id).select("-password");
  res.json(patient);
};

const updateProfile = async (req, res) => {
  try {
    const patient = await Patient.findById(req.user._id);
    if (!patient) return res.status(404).json({ message: "Not found" });

    const updates = ["name", "bloodGroup", "mobile", "medicalRecords"];
    updates.forEach((field) => {
      if (req.body[field]) patient[field] = req.body[field];
    });

    // If coordinates are passed directly
    if (req.body.location) {
      patient.location = {
        type: "Point",
        coordinates: req.body.location, // [lng, lat]
      };
    }

    // If address string is passed instead
    if (req.body.address) {
      const coordinates = await getCoordinates(req.body.address);
      patient.location = {
        type: "Point",
        coordinates,
      };
    }

    await patient.save();
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating profile" });
  }
};

//=====================
//*COMPATIBILITY BLOOD GROUPS LOGIC*//
//======================

const bloodCompatibility = {
  "O-": ["O-"],
  "O+": ["O-", "O+"],
  "A-": ["O-", "A-"],
  "A+": ["O-", "O+", "A-", "A+"],
  "B-": ["O-", "B-"],
  "B+": ["O-", "O+", "B-", "B+"],
  "AB-": ["O-", "A-", "B-", "AB-"],
  "AB+": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
};

function getCompatibleBloodGroups(bloodGroup) {
  if (!bloodCompatibility[bloodGroup]) {
    throw new Error("Invalid blood group");
  }
  return bloodCompatibility[bloodGroup] || [];
}

//=====================
//*BLOOD BANK SEARCH LOGIC*//
//=====================

const RADIUS_INCREMENT = 3000;
const INITIAL_RADIUS = 7000; // Start with 7 km
const MAX_RADIUS = 10000; // Extend to 10 km if needed

// Helper function to generate Google & Apple Maps direction URLs
const buildDirectionLinks = (patientLat, patientLng, bankLat, bankLng) => {
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${patientLat},${patientLng}&destination=${bankLat},${bankLng}`;
  const appleMapsUrl = `http://maps.apple.com/?saddr=${patientLat},${patientLng}&daddr=${bankLat},${bankLng}`;
  return { googleMapsUrl, appleMapsUrl };
};

const smartSearchBloodBanks = async (req, res) => {
  try {
    const { bloodGroup, latitude, longitude } = req.query;

    const patientLat = parseFloat(latitude);
    const patientLng = parseFloat(longitude);

    const searchedGroup = bloodGroup?.trim(); // Ensure trimmed string
    let compatibleGroups = [];

    if (searchedGroup) {
      if (!bloodCompatibility[searchedGroup]) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid blood group" });
      }
      compatibleGroups = getCompatibleBloodGroups(searchedGroup);
    }

    let radius = INITIAL_RADIUS;
    let found = false;
    let responseData = [];

    while (radius <= MAX_RADIUS && !found) {
      const nearbyBloodBanks = await BloodBank.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [patientLng, patientLat],
            },
            $maxDistance: radius,
          },
        },
      });

      if (nearbyBloodBanks.length === 0) {
        radius += RADIUS_INCREMENT;
        continue;
      }

      if (!searchedGroup) {
        const bankIds = nearbyBloodBanks.map((b) => b._id);
      
        const inventories = await Inventory.find({
          bloodBankId: { $in: bankIds },
          quantity: { $gt: 0 },
          status: "available",
        });
      
        const bankInventoryMap = {};
      
        inventories.forEach((inv) => {
          const bankId = inv.bloodBankId.toString();
      
          if (!bankInventoryMap[bankId]) {
            bankInventoryMap[bankId] = {};
          }
      
          if (!bankInventoryMap[bankId][inv.bloodGroup]) {
            bankInventoryMap[bankId][inv.bloodGroup] = 0;
          }
      
          bankInventoryMap[bankId][inv.bloodGroup] += inv.quantity;
        });
      
        const banksWithUnits = nearbyBloodBanks.map((bank) => {
          const bankLat = bank.location.coordinates[1];
          const bankLng = bank.location.coordinates[0];
          const inventory = bankInventoryMap[bank._id.toString()] || {};
      
          const totalUnitsPerGroup = Object.entries(inventory).map(
            ([bloodGroup, units]) => ({
              bloodGroup,
              units,
            })
          );
      
          return {
            _id: bank._id,
            name: bank.name,
            address: bank.address,
            contactNumber: bank.contactNumber,
            location: bank.location,
            directionLinks: buildDirectionLinks(
              patientLat,
              patientLng,
              bankLat,
              bankLng
            ),
            availableUnits: {
              searched: null, 
              compatible: totalUnitsPerGroup,
              // summary: totalUnitsPerGroup, 
            },
          };
        });
      
        return res.status(200).json({
          success: true,
          message: "Showing all nearby blood banks with available units.",
          data: banksWithUnits,
          radiusUsed: `${radius / 1000} km`,
        });
      }
      
      // Proceed with original blood group-based inventory filtering logic here
      // (No change below this point unless optimizing)
      const nearbyBankIds = nearbyBloodBanks.map((b) => b._id);

      const inventories = await Inventory.find({
        bloodGroup: { $in: compatibleGroups },
        quantity: { $gt: 0 },
        bloodBankId: { $in: nearbyBankIds },
        status: "available",
      })
        .populate("bloodBankId", "name address contactNumber location")
        .sort({ quantity: -1 });

      if (inventories.length > 0) {
        const groupedResults = {};

        inventories.forEach((inv) => {
          const id = inv.bloodBankId._id;
          const bankLat = inv.bloodBankId.location.coordinates[1];
          const bankLng = inv.bloodBankId.location.coordinates[0];

          if (!groupedResults[id]) {
            groupedResults[id] = {
              _id: id,
              name: inv.bloodBankId.name,
              address: inv.bloodBankId.address,
              contactNumber: inv.bloodBankId.contactNumber,
              location: inv.bloodBankId.location,
              directionLinks: buildDirectionLinks(
                patientLat,
                patientLng,
                bankLat,
                bankLng
              ),
              availableUnits: {
                searched: null,
                compatible: [],
              },
            };
          }

          if (inv.bloodGroup === searchedGroup) {
            if (!groupedResults[id].availableUnits.searched) {
              groupedResults[id].availableUnits.searched = {
                bloodGroup: searchedGroup,
                units: inv.quantity,
              };
            } else {
              groupedResults[id].availableUnits.searched.units += inv.quantity;
            }
          } else {
            const existing = groupedResults[id].availableUnits.compatible.find(
              (entry) => entry.bloodGroup === inv.bloodGroup
            );
            if (existing) {
              existing.units += inv.quantity;
            } else {
              groupedResults[id].availableUnits.compatible.push({
                bloodGroup: inv.bloodGroup,
                units: inv.quantity,
              });
            }
          }
        });

        responseData = Object.values(groupedResults);
        found = true;

        return res.status(200).json({
          success: true,
          data: responseData,
          radiusUsed: `${radius / 1000} km`,
        });
      }

      radius += RADIUS_INCREMENT;
    }
    // Fallback: nearest blood bank even if no units available
    const fallback = await BloodBank.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [patientLng, patientLat],
          },
          distanceField: "dist.calculated",
          maxDistance: MAX_RADIUS,
          spherical: true,
        },
      },
      { $limit: 1 },
    ]);

    if (fallback.length > 0) {
      const fallbackBank = fallback[0];
      const bankLat = fallbackBank.location.coordinates[1];
      const bankLng = fallbackBank.location.coordinates[0];

      return res.status(200).json({
        success: false,
        message:
          "No blood banks with available units found. Showing nearest blood bank.",
        data: [
          {
            ...fallbackBank,
            directionLinks: buildDirectionLinks(
              patientLat,
              patientLng,
              bankLat,
              bankLng
            ),
          },
        ],
        radiusUsed: "Beyond 10 km",
      });
    }

    return res.status(404).json({
      success: false,
      message: "No blood banks found nearby.",
    });
  } catch (error) {
    console.error("Search Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  registerPatient,
  verifyOtpForRegistration,
  addPatientDetails,
  loginSendOtp,
  loginVerifyOtp,
  getProfile,
  updateProfile,
  smartSearchBloodBanks,
};
