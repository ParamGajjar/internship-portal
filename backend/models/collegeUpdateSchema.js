import mongoose from "mongoose";

const collegeUpdateSchema = new mongoose.Schema(
  {
    college: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    internship: { type: mongoose.Schema.Types.ObjectId, ref: "Internship", required: true },
    application: { type: mongoose.Schema.Types.ObjectId, ref: "Application", required: true },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
  },
  { timestamps: true }
);

export const CollegeUpdate = mongoose.model("CollegeUpdate", collegeUpdateSchema);
