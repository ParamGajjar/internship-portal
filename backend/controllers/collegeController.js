import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import { Internship } from "../models/InternshipSchema.js";
import { Application } from "../models/applicationSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { CollegeUpdate } from "../models/collegeUpdateSchema.js";

export const getCollegeUpdates = catchAsyncErrors(async (req, res, next) => {
  if (req.user.role !== "College") {
    return next(new ErrorHandler("Only college accounts can view these updates.", 403));
  }
  const updates = await CollegeUpdate.find({ college: req.user._id })
    .populate("student", "name studentProfile.branch")
    .populate("company", "name companyProfile.companyName")
    .populate("internship", "title")
    .sort({ createdAt: -1 })
    .limit(30);
  res.status(200).json({ success: true, count: updates.length, updates });
});

// =====================================================
// GET COLLEGE DASHBOARD STATISTICS
// =====================================================
export const getCollegeDashboard = catchAsyncErrors(
  async (req, res, next) => {
    if (req.user.role !== "College") {
      return next(
        new ErrorHandler(
          "Only college accounts can access this resource.",
          403
        )
      );
    }

    // Total users by role
    const totalStudents = await User.countDocuments({
      role: "Student",
    });

    const totalCompanies = await User.countDocuments({
      role: "Company",
    });

    // Total internships
    const totalInternships =
      await Internship.countDocuments();

    const activeInternships =
      await Internship.countDocuments({
        status: "Open",
        applicationDeadline: { $gte: new Date() },
      });

    // Total applications
    const totalApplications =
      await Application.countDocuments();

    // Application status statistics
    const applicationStatusStats =
      await Application.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ]);

    // Recent applications
    const recentApplications =
      await Application.find()
        .populate(
          "student",
          "name email studentProfile.college studentProfile.branch"
        )
        .populate(
          "company",
          "name companyProfile.companyName"
        )
        .populate(
          "internship",
          "title category type"
        )
        .sort({
          createdAt: -1,
        })
        .limit(10);

    res.status(200).json({
      success: true,

      statistics: {
        totalStudents,
        totalCompanies,
        totalInternships,
        activeInternships,
        totalApplications,
      },

      applicationStatusStats,

      recentApplications,
    });
  }
);

// =====================================================
// GET ALL STUDENTS
// =====================================================
export const getAllStudents = catchAsyncErrors(
  async (req, res, next) => {
    if (req.user.role !== "College") {
      return next(
        new ErrorHandler(
          "Only college accounts can access student records.",
          403
        )
      );
    }

    const {
      search,
      branch,
      semester,
    } = req.query;

    const filter = {
      role: "Student",
    };

    // Search by name or email
    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Filter by branch
    if (branch) {
      filter["studentProfile.branch"] = {
        $regex: branch,
        $options: "i",
      };
    }

    // Filter by semester
    if (semester) {
      filter["studentProfile.semester"] =
        Number(semester);
    }

    const students = await User.find(filter)
      .select(
        "name email phone studentProfile createdAt"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  }
);

// =====================================================
// GET SINGLE STUDENT DETAILS
// =====================================================
export const getStudentDetails = catchAsyncErrors(
  async (req, res, next) => {
    if (req.user.role !== "College") {
      return next(
        new ErrorHandler(
          "Only college accounts can access this resource.",
          403
        )
      );
    }

    const student = await User.findOne({
      _id: req.params.studentId,
      role: "Student",
    }).select(
      "name email phone studentProfile createdAt"
    );

    if (!student) {
      return next(
        new ErrorHandler("Student not found.", 404)
      );
    }

    // Get all applications of the student
    const applications =
      await Application.find({
        student: student._id,
      })
        .populate(
          "internship",
          "title category type duration stipend"
        )
        .populate(
          "company",
          "name companyProfile.companyName"
        )
        .sort({
          createdAt: -1,
        });

    // Application statistics for this student
    const applicationStats =
      await Application.aggregate([
        {
          $match: {
            student: student._id,
          },
        },
        {
          $group: {
            _id: "$status",
            count: {
              $sum: 1,
            },
          },
        },
      ]);

    res.status(200).json({
      success: true,
      student,
      applicationStats,
      applications,
    });
  }
);

// =====================================================
// GET ALL COMPANIES
// =====================================================
export const getAllCompanies = catchAsyncErrors(
  async (req, res, next) => {
    if (req.user.role !== "College") {
      return next(
        new ErrorHandler(
          "Only college accounts can access company records.",
          403
        )
      );
    }

    const companies = await User.find({
      role: "Company",
    })
      .select(
        "name email phone companyProfile createdAt"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: companies.length,
      companies,
    });
  }
);

// =====================================================
// GET ALL INTERNSHIP ANALYTICS
// =====================================================
export const getInternshipAnalytics =
  catchAsyncErrors(async (req, res, next) => {
    if (req.user.role !== "College") {
      return next(
        new ErrorHandler(
          "Only college accounts can access analytics.",
          403
        )
      );
    }

    // Internships by category
    const internshipsByCategory =
      await Internship.aggregate([
        {
          $group: {
            _id: "$category",
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ]);

    // Internships by work type
    const internshipsByType =
      await Internship.aggregate([
        {
          $group: {
            _id: "$type",
            count: {
              $sum: 1,
            },
          },
        },
      ]);

    // Applications by internship
    const applicationsByInternship =
      await Application.aggregate([
        {
          $group: {
            _id: "$internship",
            applicationCount: {
              $sum: 1,
            },
          },
        },
        {
          $lookup: {
            from: "internships",
            localField: "_id",
            foreignField: "_id",
            as: "internshipDetails",
          },
        },
        {
          $unwind: "$internshipDetails",
        },
        {
          $project: {
            _id: 0,
            internshipId: "$_id",
            title: "$internshipDetails.title",
            category:
              "$internshipDetails.category",
            applicationCount: 1,
          },
        },
        {
          $sort: {
            applicationCount: -1,
          },
        },
      ]);

    // Monthly application statistics
    const monthlyApplications =
      await Application.aggregate([
        {
          $group: {
            _id: {
              year: {
                $year: "$createdAt",
              },
              month: {
                $month: "$createdAt",
              },
            },
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]);

    res.status(200).json({
      success: true,

      internshipsByCategory,

      internshipsByType,

      applicationsByInternship,

      monthlyApplications,
    });
  });
