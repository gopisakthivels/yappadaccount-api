import "dotenv/config";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import User from "../models/User.js";

async function main() {
  await connectDB();

  console.log("🔄 Starting organizationId migration...");

  // Find all admin users without organizationId
  const adminsWithoutOrg = await User.find({
    role: "admin",
    organizationId: { $exists: false },
  });

  console.log(`Found ${adminsWithoutOrg.length} admin(s) without organizationId`);

  let migrated = 0;
  for (const admin of adminsWithoutOrg) {
    const organizationId = new mongoose.Types.ObjectId().toString();
    admin.organizationId = organizationId;
    await admin.save();
    migrated++;
    console.log(
      `✅ Assigned organizationId to admin: ${admin.email} (${organizationId})`
    );
  }

  // Find all regular users without organizationId (invited users)
  // These will remain without organizationId until they're invited by an admin
  const usersWithoutOrg = await User.find({
    role: "user",
    organizationId: { $exists: false },
  });

  console.log(
    `ℹ️  Found ${usersWithoutOrg.length} user(s) without organizationId (these will be assigned when invited)`
  );

  console.log(`\n✅ Migration complete! Migrated ${migrated} admin(s).`);

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error("❌ Migration failed:", err);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
