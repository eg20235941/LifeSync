
import mongoose from "mongoose";

// Define the Task schema
const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },

    title: {
  type: String,
  required: [true, "Task title is required"],
  trim: true,
  maxlength: 150,
  validate: {
    validator: function (value) {
      return (
        typeof value === "string" &&
        value.trim().length > 0
      );
    },
    message: "Task title cannot be empty",
  },
},
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    status: {
      type: String,
      enum: ["todo", "in_progress", "done"],
      default: "todo",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    dueDate: {
      type: Date,
      default: null,
    },

    position: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Optimize queries for each user's Kanban board
taskSchema.index({
  user: 1,
  status: 1,
  position: 1,
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
