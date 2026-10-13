import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide an internship title."],
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    description: {
      type: String,
      required: [true, "Please provide an internship description."],
      minlength: 30,
      maxlength: 5000,
    },

    category: {
      type: String,
      required: [true, "Please provide an internship category."],
      trim: true,
    },

    requiredSkills: {
      type: [String],
      default: [],
    },

    // These fields intentionally mirror the values sent and rendered by the
    // React internship form.
    duration: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    stipend: {
      type: Number,
      default: 0,
      min: 0,
    },

    type: {
      type: String,
      enum: ["Remote", "Hybrid", "On-site"],
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    openings: {
      type: Number,
      default: 1,
      min: 1,
    },

    applicationDeadline: {
      type: Date,
      required: true,
    },

    certificateProvided: {
      type: Boolean,
      default: false,
    },

    ppoOpportunity: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_document, internship) => {
        const legacyLocation = internship.location;
        const legacyDuration = internship.duration;
        const legacyStipend = internship.stipend;

        if (legacyLocation && typeof legacyLocation === "object") {
          internship.location = [
            legacyLocation.city,
            legacyLocation.state,
            legacyLocation.country,
          ].filter(Boolean).join(", ");
        }

        if (legacyDuration && typeof legacyDuration === "object") {
          internship.duration = [
            legacyDuration.value,
            legacyDuration.unit,
          ].filter(Boolean).join(" ");
        }

        if (legacyStipend && typeof legacyStipend === "object") {
          internship.stipend = Number(legacyStipend.amount) || 0;
        }

        if (!internship.type && internship.mode) {
          internship.type = internship.mode;
        }

        return internship;
      },
    },
  }
);

export const Internship = mongoose.model(
  "Internship",
  internshipSchema
);
