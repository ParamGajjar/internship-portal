import express from "express";

import {
  getStudentDashboard,
  getCompanyDashboard,
  getCollegeDashboard,
} from "../controllers/dashboardController.js";

import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();


// Student Dashboard
router.get(
  "/student",
  isAuthenticated,
  getStudentDashboard
);


// Company Dashboard
router.get(
  "/company",
  isAuthenticated,
  getCompanyDashboard
);


// College Dashboard
router.get(
  "/college",
  isAuthenticated,
  getCollegeDashboard
);


export default router;