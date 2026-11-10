import { CalendarPlus, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import EventRow from "../components/EventRow";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../lib/api";
import type { EventRecord } from "../types";

export default function Dashboard() {
  const { token, user } = useAuth();
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await apiRequest<{ events: EventRecord[] }>("/events", {}, token ?? undefined);
      setEvents(result.events);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Events could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  const filteredEvents = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return events.filter((event) => {
      const matchesCategory = category === "All" || event.category === category;
      const matchesQuery = !normalized || [event.title, event.description, event.location]
        .some((value) => value.toLowerCase().includes(normalized));
      return matchesCategory && matchesQuery;
    });
  }, [events, query, category]);

  return (
    <section className="dashboard page-container">
      <div className="dashboard-heading">
        <div>
          <span className="section-label">CAMPUS CALENDAR</span>
          <h1>Events</h1>
          <p>Welcome{user ? `, ${user.fullName}` : ""}. Browse events or manage your own.</p>
        </div>
        <Link to="/events/new" className="button"><CalendarPlus size={19} aria-hidden="true" /> Add event</Link>
      </div>

      <div className="event-tools">
        <label className="search-field">
          <span className="sr-only">Search events</span>
          <Search size={19} aria-hidden="true" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, description, or location" />
        </label>
        <label className="filter-field">
          <span>Category</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {["All", "Academic", "Club", "Sports", "Workshop", "Social", "Other"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>

      {loading && <Loading />}
      {error && (
        <div className="alert alert-error" role="alert">
          <p>{error}</p>
          <button type="button" className="text-link" onClick={() => void loadEvents()}>Try again</button>
        </div>
      )}
      {!loading && !error && (
        <>
          <div className="results-count" aria-live="polite">
            Showing {filteredEvents.length} of {events.length} events
          </div>
          {filteredEvents.length > 0 ? (
            <div className="event-list">
              {filteredEvents.map((event, index) => (
                <EventRow key={event._id} event={event} currentUserId={user?._id} index={index} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>{events.length === 0 ? "No events yet" : "No matching events"}</h2>
              <p>{events.length === 0 ? "Create the first event for the campus community." : "Clear your search or choose another category."}</p>
              {events.length === 0 ? (
                <Link to="/events/new" className="button">Create first event</Link>
              ) : (
                <button type="button" className="button button-secondary" onClick={() => { setQuery(""); setCategory("All"); }}>Clear filters</button>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}
