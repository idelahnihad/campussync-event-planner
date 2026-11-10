import mongoose from "mongoose";

export function notFound(req, res, next) {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ message: `API route not found: ${req.method} ${req.originalUrl}` });
  }
  next();
}

export function errorHandler(error, _req, res, _next) {
  if (!(error instanceof mongoose.Error.ValidationError) && error?.code !== 11000 && error?.name !== "CastError" && !error?.status) {
    console.error(error);
  }

  if (error instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(error.errors).map((item) => item.message);
    return res.status(400).json({ message: messages.join(" ") });
  }

  if (error?.code === 11000) {
    return res.status(409).json({ message: "An account with this email already exists." });
  }

  if (error?.name === "CastError") {
    return res.status(400).json({ message: "The supplied record ID is invalid." });
  }

  return res.status(error.status || 500).json({
    message: error.status ? error.message : "The server could not complete the request.",
  });
}
