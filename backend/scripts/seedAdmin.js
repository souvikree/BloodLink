const mongoose = require("mongoose");
const Admin = require("../models/AdminModel/admin");
const bcrypt = require("bcryptjs");
require("dotenv").config();

async function seedAdmin() {
  await mongoose.connect(process.env.DB);

  const existing = await Admin.findOne({ email: "admin@bloodlink.com" });
  if (existing) {
    console.log("Admin already exists");
    return process.exit(0);
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = new Admin({
    email: "admin@bloodlink.com",
    password: hashedPassword
  });

  await admin.save();
  console.log("✅ Admin seeded successfully");
  process.exit(0);
}

seedAdmin().catch(err => {
  console.error("❌ Seeding failed", err);
  process.exit(1);
});
