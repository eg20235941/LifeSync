
import AcademicRecord from "../models/AcademicRecord.js";
import mongoose from "mongoose";

import {
  calculateSGPA,
  calculateCGPA,
} from "../utils/gpaCalculator.js";


// POST /api/academic
// Create an academic record for the logged-in user
export const createAcademicRecord = async (req, res) => {
  try {
    const {
      moduleCode,
      moduleName,
      credits,
      grade,
      countsForGPA,
      semester,
      academicYear,
    } = req.body;

    const record = await AcademicRecord.create({
      user: req.user._id,
      moduleCode,
      moduleName,
      credits,
      grade,
      countsForGPA,
      semester,
      academicYear,
    });

    return res.status(201).json({
      success: true,
      message: "Academic record created successfully",
      data: { record },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This module already exists for this semester",
      });
    }

    if (error.name === "ValidationError" ||
        error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Create academic record error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating academic record",
    });
  }
};


/**
 * GET /api/academic
 * Get all academic records for the logged-in user.
 */
export const getAcademicRecords = async (req, res) => {
  try {
    const records = await AcademicRecord.find({
      user: req.user._id,
    }).sort({
      semester: 1,
      moduleCode: 1,
    });

    return res.status(200).json({
      success: true,
      data: {
        records,
        count: records.length,
      },
    });
  } catch (error) {
    console.error("Get academic records error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching academic records",
    });
  }
};

/**
 * GET /api/academic/:id
 * Get a single academic record belonging to the logged-in user.
 */
export const getAcademicRecordById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid academic record ID",
      });
    }

    const record = await AcademicRecord.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Academic record not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: { record },
    });
  } catch (error) {
    console.error("Get academic record error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching academic record",
    });
  }
};


/**
 * PUT /api/academic/:id
 * Update an academic record belonging to the logged-in user.
 */

/**
 * PUT /api/academic/:id
 * Update an academic record belonging to the logged-in user.
 */
export const updateAcademicRecord = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid academic record ID",
      });
    }

    // Check whether the request body is valid
    if (
      !req.body ||
      typeof req.body !== "object" ||
      Array.isArray(req.body)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid request body",
      });
    }

    const allowedFields = [
      "moduleCode",
      "moduleName",
      "credits",
      "grade",
      "countsForGPA",
      "semester",
      "academicYear",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (
        Object.prototype.hasOwnProperty.call(
          req.body,
          field
        )
      ) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    // Find only records owned by the logged-in user.
    const record = await AcademicRecord.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Academic record not found",
      });
    }

    // Apply only permitted updates.
    for (const field of Object.keys(updates)) {
      record.set(field, updates[field]);
    }

    // Runs schema validators AND pre("validate") middleware.
    await record.save();

    return res.status(200).json({
      success: true,
      message: "Academic record updated successfully",
      data: { record },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This module already exists for this semester",
      });
    }

    if (
      error.name === "ValidationError" ||
      error.name === "CastError"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Update academic record error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating academic record",
    });
  }
};




/**
 * DELETE /api/academic/:id
 * Delete an academic record belonging to the logged-in user.
 */
export const deleteAcademicRecord = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid academic record ID",
      });
    }

    const record = await AcademicRecord.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Academic record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Academic record deleted successfully",
    });
  } catch (error) {
    console.error("Delete academic record error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting academic record",
    });
  }
};



/**
 * GET /api/academic/gpa
 * Calculate semester GPAs and overall CGPA.
 */
export const getAcademicGPA = async (req, res) => {
  try {
    const records = await AcademicRecord.find({
      user: req.user._id,
    }).lean();

    // Group records by semester.
    const semesterGroups = {};

    for (const record of records) {
      const semester = record.semester;

      if (!semesterGroups[semester]) {
        semesterGroups[semester] = [];
      }

      semesterGroups[semester].push(record);
    }

    // Calculate SGPA for each semester.
    const semesters = Object.keys(semesterGroups)
      .map(Number)
      .sort((a, b) => a - b)
      .map((semester) => ({
        semester,
        sgpa: calculateSGPA(semesterGroups[semester]),
        moduleCount: semesterGroups[semester].length,
      }));

    // Calculate cumulative GPA using semester weights.
    const cgpa = calculateCGPA(records);

    const hasIncompleteGrades = records.some(
      (record) =>
        record.countsForGPA !== false &&
        record.grade == null
    );

    return res.status(200).json({
      success: true,
      data: {
        semesters,
        cgpa,
        provisional: hasIncompleteGrades,
        totalModules: records.length,
      },
    });
  } catch (error) {
    console.error("Get academic GPA error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while calculating GPA",
    });
  }
};
