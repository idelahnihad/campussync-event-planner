import "dotenv/config";
import mongoose from "mongoose";
import { app } from "./app.js";
import { connectDatabase } from "./config/db.js";

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "campussync-local-development-only-2026";
  console.warn("JWT_SECRET is not set. Using the local development key; set a private key for deployment.");
}

const port = Number(process.env.PORT) || (process.env.NODE_ENV === "production" ? 3000 : 5000);

async function start() {
  try {
    await connectDatabase();
    const server = app.listen(port, "0.0.0.0", () => {
      console.log(`CampusSync is running at http://localhost:${port}`);
    });

    async function shutdown() {
      server.close(async () => {
        await mongoose.connection.close();
        process.exit(0);
      });
    }

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (error) {
    console.error("CampusSync could not start:", error.message);
    process.exit(1);
  }
}

start();
