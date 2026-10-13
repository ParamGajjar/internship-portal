import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";
import ErrorHandler from "./error.js";
import { catchAsyncErrors } from "./catchAsyncError.js";

export const isAuthenticated = catchAsyncErrors(
  async (req, res, next) => {
    let token;

    if (
      req.cookies &&
      req.cookies.token
    ) {
      token = req.cookies.token;
    }

    // Also allow Bearer token
    if (
      !token &&
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token =
        req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new ErrorHandler(
          "Please login to access this resource.",
          401
        )
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY || "local-development-secret-change-before-deployment"
    );

    const user = await User.findById(
      decoded.id
    );

    if (!user) {
      return next(
        new ErrorHandler("User no longer exists.", 401)
      );
    }

    req.user = user;

    next();
  }
);
