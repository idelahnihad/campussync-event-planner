import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export async function requireAuth(req, res, next) {
  try {
    const authorization = req.get("Authorization") || "";
    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "A valid login token is required." });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);

    if (!user) {
      return res.status(401).json({ message: "This account is no longer available." });
    }

    req.user = user;
    next();
  } catch (_error) {
    return res.status(401).json({ message: "Your session is invalid or has expired. Please log in again." });
  }
}
