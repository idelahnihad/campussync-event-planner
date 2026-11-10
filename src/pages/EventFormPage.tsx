import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import EventForm from "../components/EventForm";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../lib/api";
import { dateInputValue, organizerId } from "../lib/events";
import type { EventInput, EventRecord } from "../types";

export default function EventFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<EventInput | undefined>();
  const [pageTitle, setPageTitle] = useState("Add event");
  const [loading, setLoading] = useState(isEditing);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const loadEvent = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const result = await apiRequest<{ event: EventRecord }>(`/events/${id}`, {}, token ?? undefined);
      if (organizerId(result.event) !== user?._id) {
        setError("You can edit only events that you created.");
        return;
      }
      setPageTitle(result.event.title);
      setInitialValues({
        title: result.event.title,
        description: result.event.description,
        category: result.event.category,
        date: dateInputValue(result.event.date),
        startTime: result.event.startTime,
        location: result.event.location,
      });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Event could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [id, token, user?._id]);

  useEffect(() => {
    void loadEvent();
  }, [loadEvent]);

  async function handleSubmit(values: EventInput) {
    setBusy(true);
    setError("");
    try {
      const result = await apiRequest<{ event: EventRecord }>(
        isEditing ? `/events/${id}` : "/events",
        {
          method: isEditing ? "PUT" : "POST",
          body: JSON.stringify(values),
        },
        token ?? undefined,
      );
      navigate(`/events/${result.event._id}`, { replace: true });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Event could not be saved.");
      setBusy(false);
    }
  }

  if (loading) return <div className="page-container"><Loading label="Loading event form" /></div>;

  return (
    <section className="form-page page-container">
      <Link to={isEditing ? `/events/${id}` : "/events"} className="text-link back-link">← Back</Link>
      <div className="form-page-heading">
        <span className="section-label">{isEditing ? "UPDATE EVENT" : "NEW EVENT"}</span>
        <h1>{isEditing ? `Edit ${pageTitle}` : "What’s happening on campus?"}</h1>
        <p>{isEditing ? "Update the event details and save your changes." : "Add the basic details students need to find and attend your event."}</p>
      </div>
      {error && <div className="alert alert-error" role="alert">{error}</div>}
      {(!isEditing || initialValues) && (
        <EventForm
          initialValues={initialValues}
          submitLabel={isEditing ? "Save changes" : "Create event"}
          busy={busy}
          onSubmit={handleSubmit}
          onCancel={() => navigate(isEditing ? `/events/${id}` : "/events")}
        />
      )}
    </section>
  );
}
