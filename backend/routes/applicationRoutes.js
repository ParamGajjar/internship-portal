import express from "express";

import {
  applyForInternship,
  getMyApplications,
  getCompanyApplications,
  getInternshipApplications,
  updateApplicationStatus,
  getSingleApplication,
  sendCollegeUpdate,
} from "../controllers/applicationController.js";

import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Student
router.post(
  "/apply",
  isAuthenticated,
  applyForInternship
);

router.get(
  "/my-applications",
  isAuthenticated,
  getMyApplications
);

// Company
router.get(
  "/company-applications",
  isAuthenticated,
  getCompanyApplications
);

router.get(
  "/internship/:internshipId",
  isAuthenticated,
  getInternshipApplications
);

router.put(
  "/update-status/:id",
  isAuthenticated,
  updateApplicationStatus
);

router.post("/college-update", isAuthenticated, sendCollegeUpdate);

// Common
router.get(
  "/:id",
  isAuthenticated,
  getSingleApplication
);

export default router;
