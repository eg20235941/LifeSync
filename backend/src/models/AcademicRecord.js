
import mongoose from "mongoose";

const academicRecordSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },

    moduleCode: {
      type: String,
      required: [true, "Module code is required"],
      trim: true,
      uppercase: true,
    },

    moduleName: {
      type: String,
      required: [true, "Module name is required"],
      trim: true,
    },

    credits: {
      type: Number,
      required: [true, "Credits are required"],
      min: [0.01, "Credits must be greater than zero"],
    },

    grade: {
      type: String,
      enum: [
        "A+", "A", "A-",
        "B+", "B", "B-",
        "C+", "C", "C-",
        "E",
        "MC", "AC", "WH",
        "PASS-H", "PASS-M", "PASS-S", "FAIL-E",
      ],
      uppercase: true,
      default: null,
    },

    // GPA modules use the standard 4.0 grading scale.
    // Non-GPA modules (e.g. Industrial Training) do not.
    countsForGPA: {
      type: Boolean,
      default: true,
    },

    semester: {
      type: Number,
      required: [true, "Semester is required"],
      min: [1, "Semester must be at least 1"],
      max: [8, "Semester cannot exceed 8"],
    },

    academicYear: {
      type: String,
      required: [true, "Academic year is required"],
      match: [
        /^\d{4}\/\d{4}$/,
        "Academic year must be in YYYY/YYYY format",
      ],
    },
  },
  {
    timestamps: true,
  }
);


const GPA_GRADES = [
  "A+", "A", "A-",
  "B+", "B", "B-",
  "C+", "C", "C-",
  "E",
];

const NON_GPA_GRADES = [
  "PASS-H",
  "PASS-M",
  "PASS-S",
  "FAIL-E",
];

const SPECIAL_GRADES = ["MC", "AC", "WH"];

// Validate grade compatibility with module type.
academicRecordSchema.pre("validate", function () {
  if (this.grade == null) {
    return;
  }

  const allowedGrades = this.countsForGPA
    ? GPA_GRADES
    : NON_GPA_GRADES;

  if (
    !allowedGrades.includes(this.grade) &&
    !SPECIAL_GRADES.includes(this.grade)
  ) {
    this.invalidate(
      "grade",
      `Grade ${this.grade} is not valid for this module type`
    );
  }
});


// Prevent duplicate modules for the same student and term.
academicRecordSchema.index(
  {
    user: 1,
    moduleCode: 1,
    semester: 1,
    academicYear: 1,
  },
  { unique: true }
);

const AcademicRecord = mongoose.model(
  "AcademicRecord",
  academicRecordSchema
);

export default AcademicRecord;
