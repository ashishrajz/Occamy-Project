import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });


import { seedUsers } from "./users.js";
import { seedDistributorDays } from "./distributorDays.js";
import { seedActivities } from "./activities.js";

async function runSeed() {
  await mongoose.connect(process.env.MONGODB_URI);

  console.log("🌱 Seeding users...");
  const { distributors } = await seedUsers();

  console.log("📅 Seeding distributor days...");
  const days = await seedDistributorDays(distributors);

  console.log("📍 Seeding activities...");
  await seedActivities(days);

  console.log("✅ DATABASE SEEDED SUCCESSFULLY");
  process.exit(0);
}

runSeed().catch(err => {
  console.error(err);
  process.exit(1);
});
