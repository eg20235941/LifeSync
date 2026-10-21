
import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/authRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";

const app = express();

// Basic security headers
app.use(helmet());

// Allow requests from our React frontend
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

// Parse incoming JSON requests
app.use(express.json());

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "LifeSync API is running",
  });
});

// Authentication API routes
app.use("/api/auth", authRoutes);

// Expense Tracker API routes
app.use("/api/expenses", expenseRoutes);

// Handle unknown API routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;
