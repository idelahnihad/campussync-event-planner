import bcrypt from "bcryptjs";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "./app.js";
import { Event } from "./models/Event.js";
import { User } from "./models/User.js";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "campussync-cypress-test-secret";

const mongo = await MongoMemoryServer.create();
await mongoose.connect(mongo.getUri("campussync-e2e"));

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
    date: "2026-12-10T12:00:00.000Z",
    startTime: "14:00",
    location: "Library Study Room 2",
    organizer: demoUser._id,
  },
  {
    title: "Campus Club Welcome Afternoon",
    description: "Meet student club representatives and learn how to join activities this semester.",
    category: "Club",
    date: "2026-12-12T12:00:00.000Z",
    startTime: "16:30",
    location: "Student Centre Main Hall",
    organizer: demoUser._id,
  },
  {
    title: "Friendly Basketball Session",
    description: "A casual indoor basketball session open to beginners and experienced players.",
    category: "Sports",
    date: "2026-12-15T12:00:00.000Z",
    startTime: "18:00",
    location: "Campus Gymnasium",
    organizer: secondUser._id,
  },
]);

const server = app.listen(4173, "127.0.0.1", () => {
  console.log("CampusSync Cypress test server is ready on port 4173.");
});

async function shutdown() {
  server.close(async () => {
    await mongoose.disconnect();
    await mongo.stop();
    process.exit(0);
  });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
