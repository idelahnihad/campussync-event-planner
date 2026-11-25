import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  createEvent,
  deleteEvent,
  getEvent,
  listEvents,
  updateEvent,
} from "../controllers/eventController.js";

export const eventRoutes = Router();

eventRoutes.route("/")
  .get(listEvents)
  .post(requireAuth, createEvent);
eventRoutes.route("/:id")
  .get(getEvent)
  .put(requireAuth, updateEvent)
  .delete(requireAuth, deleteEvent);
