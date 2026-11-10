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

eventRoutes.use(requireAuth);
eventRoutes.route("/")
  .get(listEvents)
  .post(createEvent);
eventRoutes.route("/:id")
  .get(getEvent)
  .put(updateEvent)
  .delete(deleteEvent);
