import express from "express";

import {
  getAllInternships,
  getSingleInternship,
  postInternship,
  getMyInternships,
  updateInternship,
  deleteInternship,
} from "../controllers/InternshipController.js";

import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Public
router.get("/getall", getAllInternships);

router.get("/:id", getSingleInternship);

// Company
router.post(
  "/post",
  isAuthenticated,
  postInternship
);

router.get(
  "/my-internships",
  isAuthenticated,
  getMyInternships
);

router.put(
  "/update/:id",
  isAuthenticated,
  updateInternship
);

router.delete(
  "/delete/:id",
  isAuthenticated,
  deleteInternship
);

export default router;
