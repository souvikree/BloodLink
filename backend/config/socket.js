const socketIO = require("socket.io");
const jwt = require("jsonwebtoken");
const Patient = require("../models/patientModel/Patient"); // Adjust path
const BloodBank = require("../models/BloodBankModel/BloodBank"); // Adjust path

const setupSocket = (server) => {
  const io = socketIO(server, {
    cors: { origin: "*" },
  });

  // ✅ Auth middleware that checks both Patient and BloodBank
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Token missing"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      let user = await Patient.findById(decoded.id);
      if (user) {
        socket.userType = "Patient";
        socket.userId = user._id.toString();
        return next();
      }

      user = await BloodBank.findById(decoded.id);
      if (user) {
        socket.userType = "BloodBank";
        socket.userId = user._id.toString();
        return next();
      }

      return next(new Error("User not found"));
    } catch (err) {
      console.error("Socket auth error:", err.message);
      return next(new Error("Unauthorized"));
    }
  });

  // ✅ On connection, auto-join their personal room
  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.userType} ${socket.userId}`);
    socket.join(socket.userId); // Room is user ID
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.userId);
    });
  });

  return io;
};

module.exports = setupSocket;
