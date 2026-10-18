
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// 1. Define the user schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 80,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please enter a valid email",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// 2. Hash the password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
});

// 3. Compare entered password with stored hash
userSchema.methods.comparePassword = async function (
  enteredPassword
) {
  return bcrypt.compare(enteredPassword, this.password);
};

// 4. Export the User model
const User = mongoose.model("User", userSchema);

export default User;
