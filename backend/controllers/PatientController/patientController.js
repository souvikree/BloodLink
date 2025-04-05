const Patient = require('../../models/patientModel/Patient');
const { generateToken } = require('../../utils/jwt');

const registerPatient = async (req, res) => {
  const { name, email, password, bloodGroup, location } = req.body;
  const existing = await Patient.findOne({ email });
  if (existing) return res.status(400).json({ message: 'User exists' });

  const patient = await Patient.create(
    { 
      name, 
      email, 
      password, 
      bloodGroup,
      location: {
        type: 'Point',
        coordinates: location,
      },
    });
  res.status(201).json({
    _id: patient._id,
    name: patient.name,
    token: generateToken(patient._id),
  });
};

const loginPatient = async (req, res) => {
  const { email, password } = req.body;
  const patient = await Patient.findOne({ email });

  if (!patient || !(await patient.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.json({
    _id: patient._id,
    name: patient.name,
    token: generateToken(patient._id),
  });
};


//PROFILE MANAGEMENT 

const getProfile = async (req, res) => {
    const patient = await Patient.findById(req.user._id).select('-password');
    res.json(patient);
  };
  
const updateProfile = async (req, res) => {
    const patient = await Patient.findById(req.user._id);
    if (!patient) return res.status(404).json({ message: 'Not found' });
  
    const updates = ['name', 'bloodGroup', 'emergencyContact', 'medicalRecords'];
    updates.forEach((field) => {
      if (req.body[field]) patient[field] = req.body[field];
    });
  
    if (req.body.location) {
      patient.location = {
        type: 'Point',
        coordinates: req.body.location, // [lng, lat]
      };
    }
  
    await patient.save();
    res.json({ message: 'Profile updated' });
  };
  

//SEARCH NEARBY 7KM RADIUS

const searchNearby = async (req, res) => {
    const { bloodGroup, lng, lat } = req.query;
  
    const radiusInMeters = 7000;
  
    const bloodBanks = await BloodBank.find({
      bloodGroupAvailable: bloodGroup,
      location: {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          $maxDistance: radiusInMeters,
        },
      },
    });
  
    res.json({ bloodBanks });
  };
  


module.exports = {
    registerPatient,
    loginPatient,
    getProfile,
    updateProfile,
    searchNearby,
  };