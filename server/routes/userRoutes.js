import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { deleteMyAccount, getMyProfile, updateMyProfile } from "../controllers/userController.js";

export const userRoutes = Router();

userRoutes.use(requireAuth);
userRoutes.route("/me")
  .get(getMyProfile)
  .put(updateMyProfile)
  .delete(deleteMyAccount);
