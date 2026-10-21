
import express from "express";

import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All expense routes require JWT authentication
router.use(protect);

// Create a transaction
router.post("/", createExpense);

// Get all transactions
router.get("/", getExpenses);

// Get one transaction by ID
router.get("/:id", getExpenseById);

// Update a transaction by ID
router.put("/:id", updateExpense);

// Delete a transaction by ID
router.delete("/:id", deleteExpense);

export default router;
