const Patient = require('../../models/patientModel/Patient');
const { generateToken } = require('../../utils/jwt');
const redis = require('../../utils/redisClient');
const sendOtp = require('../../utils/twilio');
const { getCoordinates } = require('../../utils/geocode');
const BloodBank = require('../../models/BloodBankModel/BloodBank');
const Inventory = require('../../models/BloodBankModel/Inventory');

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
  

//SEARCH NEARBY 7KM RADIUS

const MAX_RADIUS = 15000; // 15 km in meters
const INITIAL_RADIUS = 7000; // 7 km in meters
const RADIUS_INCREMENT = 3000; // 3 km increment

const smartSearchBloodBanks = async (req, res) => {
  try {
    const { bloodGroup, latitude, longitude } = req.query;

    if (!bloodGroup || !latitude || !longitude) {
      return res.status(400).json({ message: "bloodGroup, latitude, and longitude are required." });
    }

    let radius = INITIAL_RADIUS;
    let matchingBloodBankIds = [];
    let bloodBanks = [];

    while (radius <= MAX_RADIUS) {
      const nearbyBloodBanks = await BloodBank.find({
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: [parseFloat(longitude), parseFloat(latitude)] },
            $maxDistance: radius,
          }
        }
      });

      if (!nearbyBloodBanks.length) {
        radius += RADIUS_INCREMENT;
        continue;
      }

      const bloodBankIds = nearbyBloodBanks.map(bank => bank._id);

      // Get blood banks with this blood group in inventory and > 0 quantity
      bloodBanks = await Inventory.find({
        bloodGroup,
        quantity: { $gt: 0 },
        bloodBankId: { $in: bloodBankIds }
      })
        .populate("bloodBankId", "name address contactNumber location")
        .sort({ quantity: -1 }); // Prioritize more stock

      if (bloodBanks.length > 0) break;

      radius += RADIUS_INCREMENT;
    }

    if (!bloodBanks.length) {
      return res.status(404).json({ message: "No blood banks found within the available radius." });
    }

    res.status(200).json({
      nearbyBloodBanks: bloodBanks,
      radiusUsed: radius / 1000 + " km"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  smartSearchBloodBanks
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