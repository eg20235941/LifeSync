
import "dotenv/config";
import mongoose from "mongoose";
import assert from "node:assert/strict";

import User from "../src/models/User.js";
import Expense from "../src/models/Expense.js";
import Task from "../src/models/Task.js";
import AcademicRecord from "../src/models/AcademicRecord.js";

const testModels = async () => {
  let testUser;

  try {
    // Connect to a separate test database.
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "lifesync_model_test",
    });

    console.log("Connected to test database");

    // 1. Test User model
    testUser = await User.create({
      name: "Test Student",
      email: `test-${new mongoose.Types.ObjectId()}@example.com`,
      password: "TestPassword123!",
    });

    assert.notEqual(testUser.password, "TestPassword123!");

    assert.equal(
      await testUser.comparePassword("TestPassword123!"),
      true
    );

    console.log("PASS: User creation and password hashing");

    // 2. Test Expense model and CRUD
    const expense = await Expense.create({
      user: testUser._id,
      type: "expense",
      amount: 1500,
      category: "Food",
      description: "University lunch",
    });

    const savedExpense = await Expense.findById(expense._id);
    assert.equal(savedExpense.amount, 1500);

    savedExpense.amount = 1800;
    await savedExpense.save();

    assert.equal(
      (await Expense.findById(expense._id)).amount,
      1800
    );

    await Expense.findByIdAndDelete(expense._id);
    assert.equal(await Expense.findById(expense._id), null);

    console.log("PASS: Expense CRUD operations");

    // 3. Test Task model
    const task = await Task.create({
      user: testUser._id,
      title: "Complete assignment",
      priority: "high",
    });

    assert.equal(task.status, "todo");

    console.log("PASS: Task creation and default status");

    // 4. Test AcademicRecord model
    const academicRecord = await AcademicRecord.create({
      user: testUser._id,
      moduleCode: "ec4307",
      moduleName: "Web Application Development",
      credits: 3,
      grade: "A",
      semester: 1,
      academicYear: "2025/2026",
    });

    assert.equal(academicRecord.moduleCode, "EC4307");

    console.log("PASS: Academic record creation");

    // 5. Test validation
    const invalidExpense = new Expense({
      user: testUser._id,
      type: "expense",
      amount: -500,
      category: "Food",
    });

    await assert.rejects(
      invalidExpense.validate(),
      /Amount must be greater than zero/
    );

    console.log("PASS: Expense validation");

    console.log("\nAll model tests passed!");
  } catch (error) {
    console.error("Model test failed:", error.message);
    process.exitCode = 1;
  } finally {
    // Remove only records belonging to the test user.
    if (testUser) {
      try {
        await Promise.all([
          Expense.deleteMany({ user: testUser._id }),
          Task.deleteMany({ user: testUser._id }),
          AcademicRecord.deleteMany({ user: testUser._id }),
        ]);

        await User.deleteOne({ _id: testUser._id });
        console.log("Test records cleaned up");
      } catch (error) {
        console.error("Cleanup failed:", error.message);
        process.exitCode = 1;
      }
    }

    await mongoose.disconnect();
  }
};

testModels();
