import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";

// Register
export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, phone, password, role } = req.body;

  if (!name || !email || !phone || !password || !role) {
    return next(
      new ErrorHandler("Please fill all required fields.", 400)
    );
  }

  const allowedRoles = ["Student", "Company", "College"];

  if (!allowedRoles.includes(role)) {
    return next(
      new ErrorHandler("Invalid role selected.", 400)
    );
  }

  const existingUser = await User.findOne({
    email: email.toLowerCase(),
  });

  if (existingUser) {
    return next(
      new ErrorHandler("Email is already registered.", 400)
    );
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    phone,
    password,
    role,
  });

  sendToken(user, 201, res, "Registration successful!");
});

// Login
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return next(
      new ErrorHandler(
        "Please provide email, password and role.",
        400
      )
    );
  }

  const user = await User.findOne({
    email: email.toLowerCase(),
  }).select("+password");

  if (!user) {
    return next(
      new ErrorHandler("Invalid email or password.", 401)
    );
  }

  const passwordMatched = await user.comparePassword(password);

  if (!passwordMatched) {
    return next(
      new ErrorHandler("Invalid email or password.", 401)
    );
  }

  if (user.role !== role) {
    return next(
      new ErrorHandler(
        `This account is not registered as ${role}.`,
        403
      )
    );
  }

  if (!user.isActive) {
    return next(
      new ErrorHandler("This account has been deactivated.", 403)
    );
  }

  sendToken(user, 200, res, "Login successful!");
});

// Logout
export const logout = catchAsyncErrors(async (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    })
    .json({
      success: true,
      message: "Logged out successfully!",
    });
});

// Get current user
export const getUser = catchAsyncErrors(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

// Update profile
export const updateProfile = catchAsyncErrors(
  async (req, res, next) => {
    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new ErrorHandler("User not found.", 404));
    }

    const { name, phone } = req.body;

    if (name) user.name = name;
    if (phone) user.phone = phone;

    // Student profile update
    if (user.role === "Student" && req.body.studentProfile) {
      user.studentProfile = {
        ...user.studentProfile.toObject(),
        ...req.body.studentProfile,
      };
    }

    // Company profile update
    if (user.role === "Company" && req.body.companyProfile) {
      user.companyProfile = {
        ...user.companyProfile.toObject(),
        ...req.body.companyProfile,
      };
    }

    // College profile update
    if (user.role === "College" && req.body.collegeProfile) {
      user.collegeProfile = {
        ...user.collegeProfile.toObject(),
        ...req.body.collegeProfile,
      };
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      user,
    });
  }
);