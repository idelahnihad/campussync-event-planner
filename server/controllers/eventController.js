import { Event } from "../models/Event.js";

const EVENT_FIELDS = ["title", "description", "category", "date", "startTime", "location"];

function eventInput(body) {
  return Object.fromEntries(
    EVENT_FIELDS
      .filter((field) => body[field] !== undefined)
      .map((field) => [field, body[field]]),
  );
}

async function findEvent(id) {
  const event = await Event.findById(id).populate("organizer", "fullName email");
  if (!event) {
    const error = new Error("Event not found.");
    error.status = 404;
    throw error;
  }
  return event;
}

function checkOwnership(event, user) {
  const organizerId = event.organizer._id || event.organizer;
  return organizerId.toString() === user._id.toString();
}

export async function listEvents(_req, res, next) {
  try {
    const events = await Event.find()
      .populate("organizer", "fullName email")
      .sort({ date: 1, startTime: 1 });
    return res.json({ count: events.length, events });
  } catch (error) {
    next(error);
  }
}

export async function getEvent(req, res, next) {
  try {
    const event = await findEvent(req.params.id);
    return res.json({ event });
  } catch (error) {
    next(error);
  }
}

export async function createEvent(req, res, next) {
  try {
    const event = await Event.create({
      ...eventInput(req.body),
      organizer: req.user._id,
    });
    await event.populate("organizer", "fullName email");
    return res.status(201).json({ message: "Event created successfully.", event });
  } catch (error) {
    next(error);
  }
}

export async function updateEvent(req, res, next) {
  try {
    const event = await findEvent(req.params.id);

    if (!checkOwnership(event, req.user)) {
      return res.status(403).json({ message: "You can edit only events that you created." });
    }

    Object.assign(event, eventInput(req.body));
    await event.save();
    return res.json({ message: "Event updated successfully.", event });
  } catch (error) {
    next(error);
  }
}

export async function deleteEvent(req, res, next) {
  try {
    const event = await findEvent(req.params.id);

    if (!checkOwnership(event, req.user)) {
      return res.status(403).json({ message: "You can delete only events that you created." });
    }

    await event.deleteOne();
    return res.json({ message: "Event deleted successfully.", deletedId: req.params.id });
  } catch (error) {
    next(error);
  }
}
