import jwt from "jsonwebtoken";

export function createToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "2h" },
  );
}

export function publicUser(user) {
  return {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
