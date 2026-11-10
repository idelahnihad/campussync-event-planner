import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoose from "mongoose";
import { authRoutes } from "./routes/authRoutes.js";
import { eventRoutes } from "./routes/eventRoutes.js";
import { userRoutes } from "./routes/userRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false, limit: "100kb" }));

if (process.env.NODE_ENV !== "production") {
  app.use(cors({ origin: ["http://localhost:3000", "http://127.0.0.1:3000"] }));
}

app.use("/api", rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 400,
  standardHeaders: "draft-8",
  legacyHeaders: false,
}));
app.use("/api/auth", rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 40,
  standardHeaders: "draft-8",
  legacyHeaders: false,
}));

app.get("/api/health", (_req, res) => {
  res.json({
    status: mongoose.connection.readyState === 1 ? "ok" : "database-disconnected",
    service: "CampusSync API",
    database: mongoose.connection.name || "not-connected",
  });
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use(notFound);

const frontendPath = path.resolve(__dirname, "../dist/public");
app.use(express.static(frontendPath));
app.use((req, res, next) => {
  if (req.method === "GET" && req.accepts("html")) {
    return res.sendFile(path.join(frontendPath, "index.html"), (error) => {
      if (error) next();
    });
  }
  next();
});

app.use(errorHandler);
