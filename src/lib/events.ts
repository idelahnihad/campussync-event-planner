import type { EventRecord } from "../types";

export function formatEventDate(value: string) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function dateInputValue(value: string) {
  return value.slice(0, 10);
}

export function organizerId(event: EventRecord) {
  return typeof event.organizer === "string" ? event.organizer : event.organizer._id;
}
