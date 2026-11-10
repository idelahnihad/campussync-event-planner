import bcrypt from "bcryptjs";
import { Event } from "../models/Event.js";
import { User } from "../models/User.js";
import { publicUser } from "../utils/token.js";

export function getMyProfile(req, res) {
  return res.json({ user: publicUser(req.user) });
}

export async function updateMyProfile(req, res, next) {
  try {
    const { fullName, email, currentPassword, newPassword } = req.body;

    if (fullName !== undefined) req.user.fullName = fullName;
    if (email !== undefined) req.user.email = email;

    if (newPassword !== undefined) {
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current and new passwords are required." });
      }
      if (newPassword.length < 8) {
        return res.status(400).json({ message: "The new password must contain at least 8 characters." });
      }

      const userWithPassword = await User.findById(req.user._id).select("+passwordHash");
      const matches = await bcrypt.compare(currentPassword, userWithPassword.passwordHash);
      if (!matches) {
        return res.status(401).json({ message: "The current password is incorrect." });
      }
      req.user.passwordHash = await bcrypt.hash(newPassword, 12);
    }

    await req.user.save();
    return res.json({ message: "Profile updated.", user: publicUser(req.user) });
  } catch (error) {
    next(error);
  }
}

export async function deleteMyAccount(req, res, next) {
  try {
    await Event.deleteMany({ organizer: req.user._id });
    await User.findByIdAndDelete(req.user._id);
    return res.json({ message: "Account and its events were deleted." });
  } catch (error) {
    next(error);
  }
}
