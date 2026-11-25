import { ArrowRight, CalendarDays, CalendarPlus, Clock3, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../lib/api";
import { formatEventDate } from "../lib/events";
import type { EventRecord } from "../types";

export default function Home() {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadEvents() {
    setLoading(true);
    setError("");
    try {
      const result = await apiRequest<{ events: EventRecord[] }>("/events");
      setEvents(result.events);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Events could not be loaded.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadEvents();
  }, []);

  return (
    <>
      <section className="home-hero page-container">
        <div className="hero-copy">
          <span className="section-label">GROUP 7 · COMP229</span>
          <h1>Campus plans,<br />finally in one place.</h1>
          <p>
            CampusSync helps students share workshops, club meetings, sports,
            and academic events without complicated event-management tools.
          </p>
          <div className="hero-actions">
            <Link className="button" to={user ? "/events/new" : "/register"}>
              {user ? "Create an event" : "Join CampusSync"} <ArrowRight size={19} aria-hidden="true" />
            </Link>
            <Link className="text-link" to={user ? "/events" : "/login"}>
              {user ? "Open my dashboard" : "I already have an account"}
            </Link>
          </div>
        </div>
        <div className="hero-calendar hero-calendar-release" aria-label="CampusSync second release">
          <div className="calendar-topline">
            <span>CAMPUSSYNC · RELEASE 2</span>
            <CalendarDays size={28} aria-hidden="true" />
          </div>
          <div className="release-display">Plan.<br />Share.<br />Meet.</div>
          <div className="calendar-event">
            <span className="category-label">ONE CAMPUS CALENDAR</span>
            <h2>{loading ? "Loading upcoming events" : `${events.length} upcoming ${events.length === 1 ? "event" : "events"}`}</h2>
            <p>Real event details, direct from our MongoDB database.</p>
          </div>
          <a className="calendar-note" href="#campus-events">Browse the calendar ↓</a>
        </div>
      </section>

      <section className="public-events page-container" id="campus-events" aria-labelledby="public-events-title">
        <div className="public-events-heading">
          <div>
            <span className="section-label">UPCOMING ON CAMPUS</span>
            <h2 id="public-events-title">Find your next event.</h2>
          </div>
          <p>Sign in to see full details and manage your own events.</p>
        </div>
        {loading && <Loading label="Loading campus events" />}
        {error && (
          <div className="alert alert-error" role="alert">
            <p>{error}</p>
            <button type="button" className="text-link" onClick={() => void loadEvents()}>Try again</button>
          </div>
        )}
        {!loading && !error && events.length === 0 && (
          <div className="empty-state">
            <h2>No events yet</h2>
            <p>Create the first event for the campus community.</p>
            <Link to={user ? "/events/new" : "/register"} className="button"><CalendarPlus size={18} /> Create an event</Link>
          </div>
        )}
        {!loading && !error && events.length > 0 && (
          <div className="public-event-list">
            {events.map((event, index) => (
              <article className={`public-event public-tone-${index % 4}`} key={event._id}>
                <div className="public-event-date">
                  <CalendarDays size={22} aria-hidden="true" />
                  <strong>{formatEventDate(event.date)}</strong>
                </div>
                <div className="public-event-copy">
                  <span className="category-label">{event.category}</span>
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                </div>
                <div className="public-event-meta">
                  <span><Clock3 size={18} aria-hidden="true" /> {event.startTime}</span>
                  <span><MapPin size={18} aria-hidden="true" /> {event.location}</span>
                  <Link className="text-link" to={user ? `/events/${event._id}` : "/login"}>
                    {user ? "View details" : "Sign in for details"} <ArrowRight size={17} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="home-strip">
        <div className="page-container strip-grid">
          <span className="section-label">SIMPLE BY DESIGN</span>
          <p>Create an event in under a minute.</p>
          <p>See the date, time, and location at a glance.</p>
          <p>Edit or remove your own events when plans change.</p>
        </div>
      </section>
    </>
  );
}
