
import {
  calculateSGPA,
  calculateCGPA,
} from "../src/utils/gpaCalculator.js";

// Sample academic records
const records = [
  {
    credits: 3,
    grade: "A",
    semester: 1,
  },
  {
    credits: 2,
    grade: "B+",
    semester: 1,
  },
  {
    credits: 3,
    grade: "C",
    semester: 1,
  },
];

const sgpa = calculateSGPA(records);
const cgpa = calculateCGPA(records);

console.log("SGPA:", sgpa);
console.log("CGPA:", cgpa);

// Verify expected results
if (sgpa === 3.08 && cgpa === 3.08) {
  console.log("PASS: GPA calculations are correct");
} else {
  console.log("FAIL: GPA calculations are incorrect");
  process.exitCode = 1;
}
