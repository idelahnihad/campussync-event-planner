import { ArrowLeft, CalendarDays, Clock3, MapPin, Pencil, Trash2, UserRound } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import ConfirmDialog from "../components/ConfirmDialog";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../lib/api";
import { formatEventDate, organizerId } from "../lib/events";
import type { EventRecord } from "../types";

export default function EventDetails() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventRecord | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadEvent = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await apiRequest<{ event: EventRecord }>(`/events/${id}`, {}, token ?? undefined);
      setEvent(result.event);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Event could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    void loadEvent();
  }, [loadEvent]);

  async function handleDelete() {
    setDeleting(true);
    setError("");
    try {
      await apiRequest(`/events/${id}`, { method: "DELETE" }, token ?? undefined);
      navigate("/events", { replace: true });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Event could not be deleted.");
      setConfirmOpen(false);
      setDeleting(false);
    }
  }

  if (loading) return <div className="page-container"><Loading label="Loading event details" /></div>;

  if (!event) {
    return (
      <div className="page-container narrow-page">
        <div className="alert alert-error" role="alert">{error || "Event not found."}</div>
        <Link to="/events" className="text-link"><ArrowLeft size={18} /> Back to events</Link>
      </div>
    );
  }

  const isOwner = organizerId(event) === user?._id;
  const organizerName = typeof event.organizer === "string" ? "Campus student" : event.organizer.fullName;

  return (
    <section className="details-page page-container">
      <Link to="/events" className="text-link back-link"><ArrowLeft size={18} aria-hidden="true" /> Back to events</Link>
      {error && <div className="alert alert-error" role="alert">{error}</div>}
      <article className="event-detail">
        <div className="event-detail-title">
          <div className="event-meta-top">
            <span className="category-label">{event.category}</span>
            {isOwner && <span className="owner-label">Your event</span>}
          </div>
          <h1>{event.title}</h1>
          <p className="detail-description">{event.description}</p>
        </div>
        <aside className="event-detail-aside">
          <dl>
            <div><dt><CalendarDays size={19} aria-hidden="true" /> Date</dt><dd>{formatEventDate(event.date)}</dd></div>
            <div><dt><Clock3 size={19} aria-hidden="true" /> Start time</dt><dd>{event.startTime}</dd></div>
            <div><dt><MapPin size={19} aria-hidden="true" /> Location</dt><dd>{event.location}</dd></div>
            <div><dt><UserRound size={19} aria-hidden="true" /> Organizer</dt><dd>{organizerName}</dd></div>
          </dl>
          {isOwner && (
            <div className="owner-actions">
              <Link to={`/events/${event._id}/edit`} className="button"><Pencil size={18} aria-hidden="true" /> Edit event</Link>
              <button type="button" className="button button-danger-outline" onClick={() => setConfirmOpen(true)}><Trash2 size={18} aria-hidden="true" /> Delete</button>
            </div>
          )}
          {!isOwner && <p className="permission-note">Only the organizer can edit or delete this event.</p>}
        </aside>
      </article>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete this event?"
        message={`“${event.title}” will be permanently removed from CampusSync.`}
        confirmLabel="Delete event"
        busy={deleting}
        onConfirm={() => void handleDelete()}
        onCancel={() => setConfirmOpen(false)}
      />
    </section>
  );
}
