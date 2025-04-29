const Patient = require('../../models/patientModel/Patient');
const { generateToken } = require('../../utils/jwt');
const redis = require('../../utils/redisClient');
const sendOtp = require('../../utils/twilio');
const { getCoordinates } = require('../../utils/geocode');
const BloodBank = require('../../models/BloodBankModel/BloodBank');
const Inventory = require('../../models/BloodBankModel/Inventory');

const { validationResult } = require('express-validator');

const RESEND_COOLDOWN = 60; // seconds

const registerPatient = async (req, res) => {
  const { name, mobile } = req.body;
  if (!name || !mobile) return res.status(400).json({ message: 'Name and mobile are required' });

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
    patient = await Patient.create(
      { 
        name, 
        mobile,
        location: {
          type: 'Point',
          coordinates: [0, 0],
        }, 
      }
    );
  } else if (patient.isVerified) {
    return res.status(400).json({ message: 'Mobile already registered' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await redis.setex(`otp:${mobile}`, 300, otp);
  await sendOtp(mobile, otp);

  // Set cooldown timestamp
  await redis.setex(cooldownKey, RESEND_COOLDOWN, Date.now().toString());

  res.status(200).json({ message: 'OTP sent successfully' });
};

// 2. Verify OTP for Registration
const verifyOtpForRegistration = async (req, res) => {
  const { mobile, otp } = req.body;
  const otpKey = `otp:${mobile}`;
  const redisOtp = await redis.get(otpKey);

  if (!redisOtp || redisOtp !== otp) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  const patient = await Patient.findOne({ mobile });
  if (!patient) return res.status(404).json({ message: 'Patient not found' });

  patient.isVerified = true;
  await patient.save();
  await redis.del(otpKey);

  res.status(200).json({
    message: 'OTP verified. Registration complete.',
    token: generateToken(patient._id),
  });
};

const addPatientDetails = async (req, res) => {
  const { bloodGroup, address, medicalRecords } = req.body;

  const patient = await Patient.findById(req.user._id);
  if (!patient || !patient.isVerified) {
    return res.status(403).json({ message: 'Not allowed. Phone not verified.' });
  }

  if (bloodGroup) patient.bloodGroup = bloodGroup;
  if (medicalRecords) patient.medicalRecords = medicalRecords;

  if (address) {
    const coordinates = await getCoordinates(address); // geocoding function
    patient.location = {
      type: 'Point',
      coordinates,
    };
  }

  await patient.save();
  res.status(200).json({ message: 'Details updated successfully', patient });
};

// 4. Login via OTP
const loginSendOtp = async (req, res) => {
  const { mobile } = req.body;
  const patient = await Patient.findOne({ mobile });

  if (!patient || !patient.isVerified) {
    return res.status(404).json({ message: 'User not found or not verified' });
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

  res.status(200).json({ message: 'OTP sent for login' });
};


const loginVerifyOtp = async (req, res) => {
  const { mobile, otp } = req.body;
  const redisOtp = await redis.get(`otp:login:${mobile}`);

  if (!redisOtp || redisOtp !== otp) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  const patient = await Patient.findOne({ mobile });
  if (!patient) return res.status(404).json({ message: 'User not found' });

  await redis.del(`otp:login:${mobile}`);

  res.status(200).json({
    message: 'Login successful',
    token: generateToken(patient._id),
    name: patient.name,
  });
};
//PROFILE MANAGEMENT 

const getProfile = async (req, res) => {
    const patient = await Patient.findById(req.user._id).select('-password');
    res.json(patient);
  };
  
  const updateProfile = async (req, res) => {
    try {
      const patient = await Patient.findById(req.user._id);
      if (!patient) return res.status(404).json({ message: 'Not found' });
  
      const updates = ['name', 'bloodGroup', 'mobile', 'medicalRecords'];
      updates.forEach((field) => {
        if (req.body[field]) patient[field] = req.body[field];
      });
  
      // If coordinates are passed directly
      if (req.body.location) {
        patient.location = {
          type: 'Point',
          coordinates: req.body.location, // [lng, lat]
        };
      }
  
      // If address string is passed instead
      if (req.body.address) {
        const coordinates = await getCoordinates(req.body.address);
        patient.location = {
          type: 'Point',
          coordinates,
        };
      }
  
      await patient.save();
      res.json({ message: 'Profile updated successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error updating profile' });
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
const INITIAL_RADIUS = 7000;  // Start with 7 km
const MAX_RADIUS = 10000;     // Extend to 10 km if needed

const smartSearchBloodBanks = async (req, res) => {
  try {
    const { bloodGroup, latitude, longitude } = req.query;

    // Validate blood group
    const compatibleGroups = getCompatibleBloodGroups(bloodGroup);

    let radius = INITIAL_RADIUS;
    let found = false;
    let responseData = [];

    while (radius <= MAX_RADIUS && !found) {
      // Step 1: Find nearby blood banks within radius
      const nearbyBloodBanks = await BloodBank.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [parseFloat(longitude), parseFloat(latitude)],
            },
            $maxDistance: radius,
          },
        },
      });

      if (nearbyBloodBanks.length === 0) {
        radius += 1000;
        continue;
      }

      const nearbyBankIds = nearbyBloodBanks.map((b) => b._id);

      // Step 2: Get inventory with matching blood groups and > 0 quantity
      const inventories = await Inventory.find({
        bloodGroup: { $in: compatibleGroups },
        quantity: { $gt: 0 },
        bloodBankId: { $in: nearbyBankIds },
      })
        .populate("bloodBankId", "name address contactNumber location")
        .sort({ quantity: -1 });

      if (inventories.length > 0) {
        // Format result: group inventory by blood bank
        const groupedResults = {};

        inventories.forEach((inv) => {
          const id = inv.bloodBankId._id;
          if (!groupedResults[id]) {
            groupedResults[id] = {
              _id: id,
              name: inv.bloodBankId.name,
              address: inv.bloodBankId.address,
              contactNumber: inv.bloodBankId.contactNumber,
              location: inv.bloodBankId.location,
              availableUnits: 0,
              bloodGroups: [],
            };
          }

          groupedResults[id].availableUnits += inv.quantity;
          groupedResults[id].bloodGroups.push({
            bloodGroup: inv.bloodGroup,
            units: inv.quantity,
          });
        });

        responseData = Object.values(groupedResults);
        found = true;

        return res.status(200).json({
          success: true,
          data: responseData,
          radiusUsed: `${radius / 1000} km`,
        });
      }

      radius += 1000;
    }

    // Step 3: Fallback - nearest blood bank within 10km, even if no inventory
    const fallback = await BloodBank.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          distanceField: "dist.calculated",
          maxDistance: MAX_RADIUS,
          spherical: true,
        },
      },
      { $limit: 1 },
    ]);

    if (fallback.length > 0) {
      return res.status(200).json({
        success: false,
        message: "No blood banks with available units found. Showing nearest blood bank.",
        data: fallback,
        radiusUsed: "Beyond 10 km",
      });
    }

    // Step 4: No blood banks at all found
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