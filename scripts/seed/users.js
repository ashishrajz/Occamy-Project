import User from "../../src/lib/models/User.js";


export async function seedUsers() {
  await User.deleteMany({});

  const admin = await User.create({
    name: "Admin User",
    phone: "9999999999",
    role: "ADMIN",
    language: "en",
  });

  const distributors = await User.insertMany([
    { name: "Amit Kumar", phone: "9000000001", role: "DISTRIBUTOR", language: "hi" },
    { name: "Rohit Singh", phone: "9000000002", role: "DISTRIBUTOR", language: "hi" },
    { name: "Suresh Patil", phone: "9000000003", role: "DISTRIBUTOR", language: "mr" },
    { name: "Vikas Sharma", phone: "9000000004", role: "DISTRIBUTOR", language: "en" },
    { name: "Manoj Yadav", phone: "9000000005", role: "DISTRIBUTOR", language: "hi" },
    { name: "Pravin Deshmukh", phone: "9000000006", role: "DISTRIBUTOR", language: "mr" },
  ]);

  return { admin, distributors };
}
