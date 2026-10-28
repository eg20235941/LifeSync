
import express from "express";

import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All Task Manager routes require JWT authentication
router.use(protect);

// Create a new task
router.post("/", createTask);

// Retrieve all tasks
router.get("/", getTasks);

// Retrieve one task by ID
router.get("/:id", getTaskById);

// Update task details or Kanban status
router.put("/:id", updateTask);

// Delete a task
router.delete("/:id", deleteTask);

export default router;
