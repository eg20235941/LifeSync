
import mongoose from "mongoose";

// Define the Academic Record schema
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
        "D+", "D", "D-",
        "E", "F", "I", "W", "P",
      ],
      uppercase: true,
      default: null,
    },

    semester: {
      type: Number,
      required: [true, "Semester is required"],
      min: 1,
      max: 3,
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

// Avoid duplicate module records within the same term
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
