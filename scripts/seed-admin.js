import "dotenv/config";
import mongoose from "mongoose";
import crypto from "crypto";

import connectDB from "../config/db.js";
import User from "../models/User.js";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@test.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123";
const ADMIN_NAME = process.env.ADMIN_NAME || "Admin";
const ADMIN_USERNAME =
  process.env.ADMIN_USERNAME ||
  `admin_${ADMIN_EMAIL.split("@")[0] || crypto.randomBytes(4).toString("hex")}`;

async function main() {
  await connectDB();

  const email = ADMIN_EMAIL.toLowerCase().trim();

  const existing = await User.findOne({ email }).select("+password");
  if (existing) {
    existing.role = "admin";
    existing.isActive = true;
    if (!existing.name) existing.name = ADMIN_NAME;
    if (!existing.username) existing.username = ADMIN_USERNAME.slice(0, 30);
    if (!existing.organizationId) {
      existing.organizationId = new mongoose.Types.ObjectId().toString();
    }
    existing.password = ADMIN_PASSWORD; // will hash on save
    await existing.save();
    console.log(`✅ Updated existing admin: ${email}`);
  } else {
    const organizationId = new mongoose.Types.ObjectId().toString();
    await User.create({
      email,
      username: ADMIN_USERNAME.slice(0, 30),
      name: ADMIN_NAME,
      password: ADMIN_PASSWORD, // will hash on save
      role: "admin",
      isActive: true,
      organizationId,
    });
    console.log(`✅ Created admin: ${email} with organizationId: ${organizationId}`);
  }

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error("❌ Failed to seed admin:", err);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});

