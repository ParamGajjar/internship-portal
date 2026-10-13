import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import { Internship } from "../models/InternshipSchema.js";
import { Application } from "../models/applicationSchema.js";
import ErrorHandler from "../middlewares/error.js";


// ==========================================
// STUDENT DASHBOARD
// ==========================================

export const getStudentDashboard = catchAsyncErrors(
  async (req, res, next) => {
    if (req.user.role !== "Student") {
      return next(
        new ErrorHandler(
          "Only students can access this dashboard.",
          403
        )
      );
    }

    const studentId = req.user._id;

    const totalApplications =
      await Application.countDocuments({
        student: studentId,
      });

    const shortlisted =
      await Application.countDocuments({
        student: studentId,
        status: "Shortlisted",
      });

    const interviews =
      await Application.countDocuments({
        student: studentId,
        status: "Interview Scheduled",
      });

    const selected =
      await Application.countDocuments({
        student: studentId,
        status: "Selected",
      });

    const availableInternships =
      await Internship.countDocuments({
        status: "Open",
        applicationDeadline: {
          $gte: new Date(),
        },
      });

    const recentApplications =
      await Application.find({
        student: studentId,
      })
        .populate(
          "internship",
          "title category location stipend applicationDeadline"
        )
        .populate(
          "company",
          "name companyProfile"
        )
        .sort({
          createdAt: -1,
        })
        .limit(5);

    res.status(200).json({
      success: true,

      stats: {
        totalApplications,
        shortlisted,
        interviews,
        selected,
        availableInternships,
      },

      recentApplications,
    });
  }
);


// ==========================================
// COMPANY DASHBOARD
// ==========================================

export const getCompanyDashboard = catchAsyncErrors(
  async (req, res, next) => {
    if (req.user.role !== "Company") {
      return next(
        new ErrorHandler(
          "Only companies can access this dashboard.",
          403
        )
      );
    }

    const companyId = req.user._id;

    const totalInternships =
      await Internship.countDocuments({
        postedBy: companyId,
      });

    const activeInternships =
      await Internship.countDocuments({
        postedBy: companyId,
        status: "Open",
      });

    const totalApplications =
      await Application.countDocuments({
        company: companyId,
      });

    const selectedCandidates =
      await Application.countDocuments({
        company: companyId,
        status: "Selected",
      });

    const recentApplications =
      await Application.find({
        company: companyId,
      })
        .populate(
          "student",
          "name email phone studentProfile"
        )
        .populate(
          "internship",
          "title category location"
        )
        .sort({
          createdAt: -1,
        })
        .limit(5);

    const recentInternships =
      await Internship.find({
        postedBy: companyId,
      })
        .sort({
          createdAt: -1,
        })
        .limit(5);

    res.status(200).json({
      success: true,

      stats: {
        totalInternships,
        activeInternships,
        totalApplications,
        selectedCandidates,
      },

      recentApplications,
      recentInternships,
    });
  }
);


// ==========================================
// COLLEGE DASHBOARD
// ==========================================

export const getCollegeDashboard = catchAsyncErrors(
  async (req, res, next) => {
    if (req.user.role !== "College") {
      return next(
        new ErrorHandler(
          "Only colleges can access this dashboard.",
          403
        )
      );
    }

    const totalStudents =
      await User.countDocuments({
        role: "Student",
      });

    const totalCompanies =
      await User.countDocuments({
        role: "Company",
      });

    const totalInternships =
      await Internship.countDocuments({
        status: "Open",
      });

    const selectedStudents =
      await Application.countDocuments({
        status: "Selected",
      });

    const totalApplications =
      await Application.countDocuments();

    const recentInternships =
      await Internship.find()
        .populate(
          "postedBy",
          "name companyProfile"
        )
        .sort({
          createdAt: -1,
        })
        .limit(5);

    res.status(200).json({
      success: true,

      stats: {
        totalStudents,
        totalCompanies,
        totalInternships,
        selectedStudents,
        totalApplications,
      },

      recentInternships,
    });
  }
);