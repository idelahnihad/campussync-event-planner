import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import EventForm from "./EventForm";

const validEvent = {
  title: "  Database Study Session  ",
  description: "  Practice MongoDB queries with other COMP229 students.  ",
  category: "Academic",
  date: "2026-12-10",
  startTime: "14:30",
  location: "  Library Room 2  ",
};

describe("EventForm component", () => {
  it("renders all required event fields", () => {
    render(<EventForm submitLabel="Create event" busy={false} onSubmit={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByLabelText("Event title")).toBeRequired();
    expect(screen.getByLabelText("Category")).toHaveValue("Academic");
    expect(screen.getByLabelText("Location")).toBeRequired();
    expect(screen.getByLabelText("Date")).toBeRequired();
    expect(screen.getByLabelText("Start time")).toBeRequired();
    expect(screen.getByLabelText("Description")).toBeRequired();
  });

  it("shows validation feedback and does not submit a short description", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<EventForm submitLabel="Create event" busy={false} onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText("Event title"), validEvent.title);
    await user.type(screen.getByLabelText("Location"), validEvent.location);
    await user.type(screen.getByLabelText("Date"), validEvent.date);
    await user.type(screen.getByLabelText("Start time"), validEvent.startTime);
    await user.type(screen.getByLabelText("Description"), "Short");
    await user.click(screen.getByRole("button", { name: "Create event" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Description must contain at least 10 characters.");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits trimmed event data to the parent page", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<EventForm submitLabel="Create event" busy={false} onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText("Event title"), validEvent.title);
    await user.type(screen.getByLabelText("Location"), validEvent.location);
    await user.type(screen.getByLabelText("Date"), validEvent.date);
    await user.type(screen.getByLabelText("Start time"), validEvent.startTime);
    await user.type(screen.getByLabelText("Description"), validEvent.description);
    await user.click(screen.getByRole("button", { name: "Create event" }));

    expect(onSubmit).toHaveBeenCalledWith({
      ...validEvent,
      title: "Database Study Session",
      description: "Practice MongoDB queries with other COMP229 students.",
      location: "Library Room 2",
    });
  });

  it("uses the cancel callback and disables actions while busy", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const { rerender } = render(<EventForm submitLabel="Save changes" busy={false} onSubmit={vi.fn()} onCancel={onCancel} />);

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledOnce();

    rerender(<EventForm submitLabel="Save changes" busy onSubmit={vi.fn()} onCancel={onCancel} />);
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Saving..." })).toBeDisabled();
  });
});
