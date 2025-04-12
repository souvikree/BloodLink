const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function sendOtp(mobile, otp) {
  return await client.messages.create({
    body: `Your BloodLink OTP is: ${otp}`,
    to: `+91${mobile}`, // India format
    from: process.env.TWILIO_PHONE_NUMBER,
  });
}

module.exports = sendOtp;
