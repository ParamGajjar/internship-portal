import express from "express";

import {
  getCollegeDashboard,
  getAllStudents,
  getStudentDetails,
  getAllCompanies,
  getInternshipAnalytics,
  getCollegeUpdates,
} from "../controllers/collegeController.js";

import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/updates", isAuthenticated, getCollegeUpdates);

// All college routes require authentication

// Dashboard
router.get(
  "/dashboard",
  isAuthenticated,
  getCollegeDashboard
);

// Students
router.get(
  "/students",
  isAuthenticated,
  getAllStudents
);

router.get(
  "/students/:studentId",
  isAuthenticated,
  getStudentDetails
);

// Companies
router.get(
  "/companies",
  isAuthenticated,
  getAllCompanies
);

// Analytics
router.get(
  "/analytics",
  isAuthenticated,
  getInternshipAnalytics
);

export default router;
