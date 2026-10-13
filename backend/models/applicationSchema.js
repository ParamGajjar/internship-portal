import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    internship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Internship",
      required: true,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resume: {
      public_id: String,
      url: String,
    },

    coverLetter: {
      type: String,
      maxlength: 3000,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "Applied",
        "Under Review",
        "Shortlisted",
        "Interview Scheduled",
        "Selected",
        "Rejected",
      ],
      default: "Applied",
    },

    interview: {
      scheduled: {
        type: Boolean,
        default: false,
      },

      date: Date,

      mode: {
        type: String,
        enum: ["Online", "Offline"],
      },

      meetingLink: String,
    },

    statusHistory: [
      {
        status: String,

        changedAt: {
          type: Date,
          default: Date.now,
        },

        comment: {
          type: String,
          default: "",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications
applicationSchema.index(
  {
    student: 1,
    internship: 1,
  },
  {
    unique: true,
  }
);

export const Application = mongoose.model(
  "Application",
  applicationSchema
);