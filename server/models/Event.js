import mongoose from "mongoose";

export const EVENT_CATEGORIES = [
  "Academic",
  "Club",
  "Sports",
  "Workshop",
  "Social",
  "Other",
];

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required."],
      trim: true,
      minlength: [3, "Title must contain at least 3 characters."],
      maxlength: [120, "Title cannot exceed 120 characters."],
    },
    description: {
      type: String,
      required: [true, "Description is required."],
      trim: true,
      minlength: [10, "Description must contain at least 10 characters."],
      maxlength: [2000, "Description cannot exceed 2000 characters."],
    },
    category: {
      type: String,
      enum: {
        values: EVENT_CATEGORIES,
        message: "Choose a valid event category.",
      },
      default: "Other",
    },
    date: {
      type: Date,
      required: [true, "Event date is required."],
    },
    startTime: {
      type: String,
      required: [true, "Start time is required."],
      match: [/^([01]\d|2[0-3]):[0-5]\d$/, "Enter a valid start time."],
    },
    location: {
      type: String,
      required: [true, "Location is required."],
      trim: true,
      minlength: [2, "Location must contain at least 2 characters."],
      maxlength: [160, "Location cannot exceed 160 characters."],
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

eventSchema.index({ date: 1, startTime: 1 });

eventSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    delete returnedObject.__v;
    return returnedObject;
  },
});

export const Event = mongoose.model("Event", eventSchema);
