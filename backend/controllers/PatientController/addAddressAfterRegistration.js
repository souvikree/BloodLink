const { getCoordinates } = require('../../utils/geocode');
const Patient = require('../../models/patientModel/Patient');

exports.addAddressAfterRegistration = async (req, res) => {
  const { address } = req.body;
  if (!address) return res.status(400).json({ message: 'Address is required' });

  const patient = await Patient.findById(req.user._id);
  if (!patient) return res.status(404).json({ message: 'Patient not found' });

  const coordinates = await getCoordinates(address);
  patient.location = {
    type: 'Point',
    coordinates,
  };

  await patient.save();

  res.json({ message: 'Address added successfully', location: patient.location });
};
