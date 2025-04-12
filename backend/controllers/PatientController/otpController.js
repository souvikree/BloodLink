const Otp = require('../../models/otpModel/Otp');
const redis = require('../../utils/redisClient');
const sendOtp = require('../../utils/twilio');

const OTP_EXPIRY = 300; // 5 mins
const RESEND_COOLDOWN = 60; // 60 seconds

exports.sendOtpToMobile = async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) return res.status(400).json({ message: 'Mobile is required' });

    const otpKey = `otp:${mobile}`;
    const cooldownKey = `cooldown:${mobile}`;

    // Check for cooldown
    const ttl = await redis.ttl(cooldownKey);
    if (ttl > 0) {
      return res.status(429).json({
        message: `Please wait ${ttl} seconds before resending OTP`,
      });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in Redis with expiry
    await redis.setex(otpKey, OTP_EXPIRY, otp);

    // Set cooldown key
    await redis.setex(cooldownKey, RESEND_COOLDOWN, '1');

    // Optional MongoDB backup
    await Otp.create({ mobile, otp });

    // Send via Twilio
    await sendOtp(mobile, otp);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'OTP sending failed' });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    const otpKey = `otp:${mobile}`;

    const redisOtp = await redis.get(otpKey);
    if (!redisOtp || redisOtp !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Set verification flag
    await redis.setex(`verified:${mobile}`, 600, true); // optional: 10 min verification window

    // Delete OTP (optional)
    await redis.del(otpKey);

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'OTP verification failed' });
  }
};
