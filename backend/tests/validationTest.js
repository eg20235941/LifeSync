import mongoose from "mongoose";
import Expense from "../src/models/Expense.js";
import Task from "../src/models/Task.js";
import AcademicRecord from "../src/models/AcademicRecord.js";

const userId = new mongoose.Types.ObjectId();

async function runTest(name, Model, data, shouldPass) {
  const document = new Model({
    user: userId,
    ...data,
  });

  try {
    await document.validate();

    if (shouldPass) {
      console.log(`PASS: ${name}`);
      return true;
    }

    console.log(`FAIL: ${name} - invalid data was accepted`);
    return false;
  } catch (error) {
    if (!shouldPass && error.name === "ValidationError") {
      console.log(`PASS: ${name} - invalid data rejected`);
      return true;
    }

    console.log(`FAIL: ${name} - ${error.message}`);
    return false;
  }
}

async function main() {
  const tests = [
    [
      "Valid expense",
      Expense,
      {
        type: "expense",
        amount: 500,
        category: "Food",
      },
      true,
    ],
    [
      "Blank expense category",
      Expense,
      {
        type: "expense",
        amount: 500,
        category: "   ",
      },
      false,
    ],
    [
      "Negative expense amount",
      Expense,
      {
        type: "expense",
        amount: -100,
        category: "Food",
      },
      false,
    ],
    [
      "Valid task",
      Task,
      {
        title: "Complete assignment",
        status: "todo",
      },
      true,
    ],
    [
      "Blank task title",
      Task,
      {
        title: "   ",
      },
      false,
    ],
    [
      "Invalid task status",
      Task,
      {
        title: "Study",
        status: "waiting",
      },
      false,
    ],
    [
      "Valid academic record",
      AcademicRecord,
      {
        moduleCode: "EC4202",
        moduleName: "Computer Architecture",
        credits: 3,
        grade: "A",
        semester: 4,
        academicYear: "2024/2025",
      },
      true,
    ],
    [
      "Decimal semester",
      AcademicRecord,
      {
        moduleCode: "EC4202",
        moduleName: "Computer Architecture",
        credits: 3,
        grade: "A",
        semester: 2.5,
        academicYear: "2024/2025",
      },
      false,
    ],
    [
      "Non-consecutive academic years",
      AcademicRecord,
      {
        moduleCode: "EC4202",
        moduleName: "Computer Architecture",
        credits: 3,
        grade: "A",
        semester: 4,
        academicYear: "2024/2027",
      },
      false,
    ],
  ];

  let passed = 0;

  for (const [name, Model, data, shouldPass] of tests) {
    if (await runTest(name, Model, data, shouldPass)) {
      passed++;
    }
  }

  console.log(`\nResults: ${passed}/${tests.length} passed`);

  if (passed !== tests.length) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});