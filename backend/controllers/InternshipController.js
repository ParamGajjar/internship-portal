import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { Internship } from "../models/InternshipSchema.js";
import ErrorHandler from "../middlewares/error.js";

// Get all active internships
export const getAllInternships = catchAsyncErrors(
  async (req, res, next) => {
    const { search, role, skill, location, type } = req.query;
    const filter = {
      status: "Open",
      applicationDeadline: { $gte: new Date() },
    };
    const terms = [search, role].filter(Boolean).map((term) =>
      term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    );
    if (terms.length) {
      filter.$or = terms.flatMap((term) => [
        { title: { $regex: term, $options: "i" } },
        { category: { $regex: term, $options: "i" } },
        { description: { $regex: term, $options: "i" } },
        { requiredSkills: { $regex: term, $options: "i" } },
      ]);
    }
    if (skill) filter.requiredSkills = { $regex: skill, $options: "i" };
    if (location) filter.location = { $regex: location, $options: "i" };
    if (type) filter.type = type;

    const internships = await Internship.find(filter)
      .populate("postedBy", "name email companyProfile")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: internships.length,
      internships,
    });
  }
);

// Create internship - Company/Admin only
export const postInternship = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;

    if (!["Company", "Admin"].includes(role)) {
      return next(
        new ErrorHandler(
          "Only companies are allowed to post internships.",
          403
        )
      );
    }

    const {
      title,
      description,
      category,
      requiredSkills,
      duration,
      stipend,
      type,
      location,
      openings,
      applicationDeadline,
      certificateProvided,
      ppoOpportunity,
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      !duration ||
      !type ||
      !applicationDeadline
    ) {
      return next(
        new ErrorHandler(
          "Please provide all required internship details.",
          400
        )
      );
    }

    const internship = await Internship.create({
      title,
      description,
      category,
      requiredSkills: requiredSkills || [],
      duration,
      stipend,
      type,
      location,
      openings,
      applicationDeadline,
      certificateProvided,
      ppoOpportunity,
      postedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Internship posted successfully!",
      internship,
    });
  }
);

// Get internships posted by logged-in company
export const getMyInternships = catchAsyncErrors(
  async (req, res, next) => {
    if (!["Company", "Admin"].includes(req.user.role)) {
      return next(
        new ErrorHandler(
          "Only companies can access their posted internships.",
          403
        )
      );
    }

    const internships = await Internship.find({
      postedBy: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: internships.length,
      internships,
    });
  }
);

// Update internship
export const updateInternship = catchAsyncErrors(
  async (req, res, next) => {
    if (!["Company", "Admin"].includes(req.user.role)) {
      return next(
        new ErrorHandler(
          "You are not authorized to update internships.",
          403
        )
      );
    }

    const { id } = req.params;

    const internship = await Internship.findById(id);

    if (!internship) {
      return next(new ErrorHandler("Internship not found.", 404));
    }

    // Company can modify only its own internships
    if (
      req.user.role === "Company" &&
      internship.postedBy.toString() !== req.user._id.toString()
    ) {
      return next(
        new ErrorHandler(
          "You can only modify internships posted by your company.",
          403
        )
      );
    }

    const updatedInternship = await Internship.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Internship updated successfully!",
      internship: updatedInternship,
    });
  }
);

// Delete internship
export const deleteInternship = catchAsyncErrors(
  async (req, res, next) => {
    if (!["Company", "Admin"].includes(req.user.role)) {
      return next(
        new ErrorHandler(
          "You are not authorized to delete internships.",
          403
        )
      );
    }

    const { id } = req.params;

    const internship = await Internship.findById(id);

    if (!internship) {
      return next(new ErrorHandler("Internship not found.", 404));
    }

    if (
      req.user.role === "Company" &&
      internship.postedBy.toString() !== req.user._id.toString()
    ) {
      return next(
        new ErrorHandler(
          "You can only delete internships posted by your company.",
          403
        )
      );
    }

    await internship.deleteOne();

    res.status(200).json({
      success: true,
      message: "Internship deleted successfully!",
    });
  }
);

// Get single internship
export const getSingleInternship = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;

    const internship = await Internship.findById(id).populate(
      "postedBy",
      "name email companyProfile"
    );

    if (!internship) {
      return next(new ErrorHandler("Internship not found.", 404));
    }

    res.status(200).json({
      success: true,
      internship,
    });
  }
);
