
import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  createAcademicRecord,
  getAcademicRecords,
  getAcademicRecordById,
  updateAcademicRecord,
  deleteAcademicRecord,
  getAcademicGPA,
} from "../controllers/academicController.js";

const router = express.Router();

// All Academic Hub routes require authentication.
router.use(protect);

// Create a module and retrieve all modules.
router
  .route("/")
  .post(createAcademicRecord)
  .get(getAcademicRecords);

// Calculate SGPA and CGPA.
router.get("/gpa", getAcademicGPA);

// Retrieve, update, or delete a specific module.
router
  .route("/:id")
  .get(getAcademicRecordById)
  .put(updateAcademicRecord)
  .delete(deleteAcademicRecord);

export default router;
