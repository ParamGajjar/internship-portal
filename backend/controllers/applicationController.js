import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { Application } from "../models/applicationSchema.js";
import { Internship } from "../models/InternshipSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { CollegeUpdate } from "../models/collegeUpdateSchema.js";

export const sendCollegeUpdate = catchAsyncErrors(async (req, res, next) => {
  if (req.user.role !== "Company") {
    return next(new ErrorHandler("Only companies can send college updates.", 403));
  }
  const { applicationId, message } = req.body;
  if (!message?.trim()) return next(new ErrorHandler("Please enter an update message.", 400));
  const application = await Application.findOne({ _id: applicationId, company: req.user._id })
    .populate("student", "studentProfile.college")
    .populate("internship", "title");
  if (!application) return next(new ErrorHandler("Application not found.", 404));
  const collegeName = application.student?.studentProfile?.college;
  const college = collegeName && await User.findOne({
    role: "College",
    "collegeProfile.collegeName": { $regex: `^${collegeName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" },
  });
  if (!college) return next(new ErrorHandler("The student's college is not linked to a college account.", 400));
  const update = await CollegeUpdate.create({
    college: college._id,
    student: application.student._id,
    company: req.user._id,
    internship: application.internship._id,
    application: application._id,
    message: message.trim(),
  });
  res.status(201).json({ success: true, message: "Private college update sent.", update });
});

// Student applies for internship
export const applyForInternship = catchAsyncErrors(
  async (req, res, next) => {
    if (req.user.role !== "Student") {
      return next(
        new ErrorHandler(
          "Only students can apply for internships.",
          403
        )
      );
    }

    const { internshipId, coverLetter } = req.body;

    if (!internshipId) {
      return next(
        new ErrorHandler(
          "Internship ID is required.",
          400
        )
      );
    }

    const internship = await Internship.findById(
      internshipId
    );

    if (!internship) {
      return next(
        new ErrorHandler("Internship not found.", 404)
      );
    }

    if (internship.status !== "Open") {
      return next(
        new ErrorHandler(
          "This internship is no longer accepting applications.",
          400
        )
      );
    }

    if (new Date(internship.applicationDeadline) < new Date()) {
      return next(
        new ErrorHandler(
          "Application deadline has passed.",
          400
        )
      );
    }

    const existingApplication =
      await Application.findOne({
        student: req.user._id,
        internship: internshipId,
      });

    if (existingApplication) {
      return next(
        new ErrorHandler(
          "You have already applied for this internship.",
          400
        )
      );
    }

    const application = await Application.create({
      student: req.user._id,
      internship: internshipId,
      company: internship.postedBy,

      resume: req.user.studentProfile?.resume || {},

      coverLetter: coverLetter || "",

      status: "Applied",

      statusHistory: [
        {
          status: "Applied",
          comment: "Application submitted successfully.",
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully!",
      application,
    });
  }
);

// Student views own applications
export const getMyApplications = catchAsyncErrors(
  async (req, res, next) => {
    if (req.user.role !== "Student") {
      return next(
        new ErrorHandler(
          "Only students can access their applications.",
          403
        )
      );
    }

    const applications = await Application.find({
      student: req.user._id,
    })
      .populate(
        "internship"
      )
      .populate(
        "company",
        "name companyProfile"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  }
);

// Company views applications for its internships
export const getCompanyApplications = catchAsyncErrors(
  async (req, res, next) => {
    if (req.user.role !== "Company") {
      return next(
        new ErrorHandler(
          "Only companies can view applicants.",
          403
        )
      );
    }

    const applications = await Application.find({
      company: req.user._id,
    })
      .populate(
        "student",
        "name email phone studentProfile"
      )
      .populate("internship")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  }
);

// Get applications for one internship
export const getInternshipApplications =
  catchAsyncErrors(async (req, res, next) => {
    const internship = await Internship.findById(
      req.params.internshipId
    );

    if (!internship) {
      return next(
        new ErrorHandler("Internship not found.", 404)
      );
    }

    if (
      req.user.role !== "Company" ||
      internship.postedBy.toString() !==
        req.user._id.toString()
    ) {
      return next(
        new ErrorHandler(
          "You are not authorized to view these applications.",
          403
        )
      );
    }

    const applications = await Application.find({
      internship: req.params.internshipId,
    })
      .populate(
        "student",
        "name email phone studentProfile"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  });

// Company updates application status
export const updateApplicationStatus =
  catchAsyncErrors(async (req, res, next) => {
    if (req.user.role !== "Company") {
      return next(
        new ErrorHandler(
          "Only companies can update application status.",
          403
        )
      );
    }

    const application = await Application.findById(
      req.params.id
    );

    if (!application) {
      return next(
        new ErrorHandler("Application not found.", 404)
      );
    }

    if (
      application.company.toString() !==
      req.user._id.toString()
    ) {
      return next(
        new ErrorHandler(
          "You are not authorized to update this application.",
          403
        )
      );
    }

    const {
      status,
      comment,
      interviewDate,
      interviewMode,
      meetingLink,
    } = req.body;

    const validStatuses = [
      "Applied",
      "Under Review",
      "Shortlisted",
      "Interview Scheduled",
      "Selected",
      "Rejected",
    ];

    if (!validStatuses.includes(status)) {
      return next(
        new ErrorHandler(
          "Invalid application status.",
          400
        )
      );
    }

    application.status = status;

    application.statusHistory.push({
      status,
      comment: comment || "",
    });

    if (status === "Interview Scheduled") {
      application.interview = {
        scheduled: true,
        date: interviewDate,
        mode: interviewMode,
        meetingLink: meetingLink || "",
      };
    }

    await application.save();

    res.status(200).json({
      success: true,
      message: "Application status updated successfully!",
      application,
    });
  });

// Student gets single application
export const getSingleApplication =
  catchAsyncErrors(async (req, res, next) => {
    const application = await Application.findById(
      req.params.id
    )
      .populate("internship")
      .populate(
        "student",
        "name email studentProfile"
      )
      .populate(
        "company",
        "name companyProfile"
      );

    if (!application) {
      return next(
        new ErrorHandler("Application not found.", 404)
      );
    }

    // Student can only see own application
    // Company can only see applications received by them
    if (
      req.user.role === "Student" &&
      application.student._id.toString() !==
        req.user._id.toString()
    ) {
      return next(
        new ErrorHandler("Unauthorized access.", 403)
      );
    }

    if (
      req.user.role === "Company" &&
      application.company._id.toString() !==
        req.user._id.toString()
    ) {
      return next(
        new ErrorHandler("Unauthorized access.", 403)
      );
    }

    res.status(200).json({
      success: true,
      application,
    });
  });
