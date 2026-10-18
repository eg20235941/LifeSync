
import mongoose from "mongoose";

// Define the Expense schema
const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },

    type: {
      type: String,
      enum: ["income", "expense"],
      required: [true, "Transaction type is required"],
    },

    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than zero"],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      maxlength: 50,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Improve queries for a user's transaction history
expenseSchema.index({ user: 1, date: -1 });

const Expense = mongoose.model(
  "Expense",
  expenseSchema
);

export default Expense;
