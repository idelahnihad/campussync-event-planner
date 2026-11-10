import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDatabase } from "./config/db.js";
import { User } from "./models/User.js";
import { Event } from "./models/Event.js";

const daysFromNow = (days) => {
  const date = new Date();
  date.setUTCHours(12, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + days);
  return date;
};

async function seed() {
  if (!process.env.JWT_SECRET) process.env.JWT_SECRET = "campussync-local-development-only-2026";
  await connectDatabase();

  await Event.deleteMany({});
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("Campus123!", 12);
  const [demoUser, secondUser] = await User.create([
    { fullName: "Demo Organizer", email: "demo@campussync.local", passwordHash },
    { fullName: "Second Student", email: "other@campussync.local", passwordHash },
  ]);

  await Event.create([
    {
      title: "Web Development Study Group",
      description: "Bring your COMP229 questions and work through API examples with other students.",
      category: "Academic",
      date: daysFromNow(7),
      startTime: "14:00",
      location: "Library Study Room 2",
      organizer: demoUser._id,
    },
    {
      title: "Campus Club Welcome Afternoon",
      description: "Meet student club representatives and learn how to join activities this semester.",
      category: "Club",
      date: daysFromNow(12),
      startTime: "16:30",
      location: "Student Centre Main Hall",
      organizer: demoUser._id,
    },
    {
      title: "Friendly Basketball Session",
      description: "A casual indoor basketball session open to beginners and experienced players.",
      category: "Sports",
      date: daysFromNow(18),
      startTime: "18:00",
      location: "Campus Gymnasium",
      organizer: secondUser._id,
    },
  ]);

  console.log("Seed complete. Accounts: demo@campussync.local and other@campussync.local");
  console.log("Password for both accounts: Campus123!");
  await mongoose.connection.close();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
