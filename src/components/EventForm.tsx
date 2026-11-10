import { useState } from "react";
import type { FormEvent } from "react";
import type { EventInput } from "../types";

const categories = ["Academic", "Club", "Sports", "Workshop", "Social", "Other"];

interface EventFormProps {
  initialValues?: EventInput;
  submitLabel: string;
  busy: boolean;
  onSubmit: (values: EventInput) => Promise<void>;
  onCancel: () => void;
}

const emptyValues: EventInput = {
  title: "",
  description: "",
  category: "Academic",
  date: "",
  startTime: "",
  location: "",
};

export default function EventForm({ initialValues, submitLabel, busy, onSubmit, onCancel }: EventFormProps) {
  const [values, setValues] = useState<EventInput>(initialValues ?? emptyValues);
  const [clientError, setClientError] = useState("");

  function updateField(field: keyof EventInput, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setClientError("");

    if (values.description.trim().length < 10) {
      setClientError("Description must contain at least 10 characters.");
      return;
    }

    await onSubmit({
      ...values,
      title: values.title.trim(),
      description: values.description.trim(),
      location: values.location.trim(),
    });
  }

  return (
    <form className="event-form" onSubmit={handleSubmit}>
      {clientError && <div className="alert alert-error" role="alert">{clientError}</div>}
      <div className="form-field form-field-wide">
        <label htmlFor="title">Event title</label>
        <input
          id="title"
          value={values.title}
          onChange={(event) => updateField("title", event.target.value)}
          minLength={3}
          maxLength={120}
          placeholder="Example: Web Development Study Group"
          required
        />
      </div>
      <div className="form-field">
        <label htmlFor="category">Category</label>
        <select id="category" value={values.category} onChange={(event) => updateField("category", event.target.value)}>
          {categories.map((category) => <option key={category}>{category}</option>)}
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="location">Location</label>
        <input
          id="location"
          value={values.location}
          onChange={(event) => updateField("location", event.target.value)}
          minLength={2}
          maxLength={160}
          placeholder="Building and room"
          required
        />
      </div>
      <div className="form-field">
        <label htmlFor="date">Date</label>
        <input id="date" type="date" value={values.date} onChange={(event) => updateField("date", event.target.value)} required />
      </div>
      <div className="form-field">
        <label htmlFor="startTime">Start time</label>
        <input id="startTime" type="time" value={values.startTime} onChange={(event) => updateField("startTime", event.target.value)} required />
      </div>
      <div className="form-field form-field-wide">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={values.description}
          onChange={(event) => updateField("description", event.target.value)}
          minLength={10}
          maxLength={2000}
          rows={6}
          placeholder="What will happen, and who should attend?"
          required
        />
        <small>{values.description.length}/2000 characters</small>
      </div>
      <div className="form-actions form-field-wide">
        <button type="button" className="button button-secondary" onClick={onCancel} disabled={busy}>Cancel</button>
        <button type="submit" className="button" disabled={busy}>{busy ? "Saving…" : submitLabel}</button>
      </div>
    </form>
  );
}
