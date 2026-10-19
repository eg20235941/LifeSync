
import express from "express";

import {
  registerUser,
  loginUser,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected route
router.get("/me", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Authenticated user retrieved successfully",
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
      },
    },
  });
});

export default router;
