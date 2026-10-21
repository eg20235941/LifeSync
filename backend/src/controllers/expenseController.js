
import Expense from "../models/Expense.js";
import mongoose from "mongoose";


// POST /api/expenses
// Create a new income or expense transaction
export const createExpense = async (req, res) => {
  try {
    const {
      type,
      amount,
      category,
      description,
      date,
    } = req.body;

    // Create the transaction for the logged-in user
    const expense = await Expense.create({
      user: req.user._id,
      type,
      amount,
      category,
      description,
      date,
    });

    return res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      data: {
        expense,
      },
    });
  } catch (error) {
    // Handle invalid input using Mongoose validation
    if (
      error.name === "ValidationError" ||
      error.name === "CastError"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Create expense error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// GET /api/expenses
// Retrieve all transactions belonging to the logged-in user
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({
      user: req.user._id,
    }).sort({ date: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Transactions retrieved successfully",
      data: {
        expenses,
        count: expenses.length,
      },
    });
  } catch (error) {
    console.error("Get expenses error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET /api/expenses/:id
// Retrieve one transaction belonging to the logged-in user
export const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check whether the ID is a valid MongoDB ObjectId
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID",
      });
    }

    const expense = await Expense.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Transaction retrieved successfully",
      data: {
        expense,
      },
    });
  } catch (error) {
    console.error("Get expense by ID error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



// PUT /api/expenses/:id
// Update a transaction belonging to the logged-in user
export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;

    // Check whether the transaction ID is valid
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID",
      });
    }

    // Allow only these fields to be updated
    const allowedFields = [
      "type",
      "amount",
      "category",
      "description",
      "date",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    // Reject requests without any updatable fields
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    // Update only a transaction owned by this user
    const expense = await Expense.findOneAndUpdate(
      {
        _id: id,
        user: req.user._id,
      },
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      data: {
        expense,
      },
    });
  } catch (error) {
    if (
      error.name === "ValidationError" ||
      error.name === "CastError"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Update expense error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// DELETE /api/expenses/:id
// Delete a transaction belonging to the logged-in user
export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID",
      });
    }

    // Delete only if the transaction belongs to this user
    const expense = await Expense.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
      data: {
        deletedId: expense._id,
      },
    });
  } catch (error) {
    console.error("Delete expense error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
