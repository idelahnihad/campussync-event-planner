import { ArrowUpRight, Clock3, MapPin } from "lucide-react";
import { Link } from "react-router";
import type { EventRecord } from "../types";
import { formatEventDate, organizerId } from "../lib/events";

interface EventRowProps {
  event: EventRecord;
  currentUserId?: string;
  index: number;
}

export default function EventRow({ event, currentUserId, index }: EventRowProps) {
  const isOwner = organizerId(event) === currentUserId;
  const organizerName = typeof event.organizer === "string" ? "Campus student" : event.organizer.fullName;

  return (
    <article className={`event-row event-tone-${index % 4}`}>
      <div className="event-row-main">
        <div className="event-meta-top">
          <span className="category-label">{event.category}</span>
          {isOwner && <span className="owner-label">Your event</span>}
        </div>
        <h2><Link to={`/events/${event._id}`}>{event.title}</Link></h2>
        <p>{event.description}</p>
        <span className="organizer-name">Organized by {organizerName}</span>
      </div>
      <div className="event-row-details">
        <strong className="event-date">{formatEventDate(event.date)}</strong>
        <span><Clock3 size={18} aria-hidden="true" /> {event.startTime}</span>
        <span><MapPin size={18} aria-hidden="true" /> {event.location}</span>
        <Link className="text-link" to={`/events/${event._id}`}>
          View details <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
