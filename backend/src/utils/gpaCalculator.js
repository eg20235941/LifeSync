
/**
 * GPA calculator based on the University of Ruhuna
 * Faculty of Engineering grading rules.
 */

export const GRADE_POINTS = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  E: 0.0,
};

const SPECIAL_GRADES = ["MC", "AC", "WH"];

// GPA results are rounded upward to two decimal places.
const roundGPA = (value) =>
  Math.ceil((value - Number.EPSILON) * 100) / 100;

// Semester weights for cumulative GPA.
const getSemesterWeight = (semester) => {
  return Number(semester) <= 2 ? 0.05 : 0.15;
};

/**
 * Calculate Semester Grade Point Average (SGPA).
 * Accepts academic records from one semester.
 */
export const calculateSGPA = (records) => {
  const gpaRecords = records.filter(
    (record) => record.countsForGPA !== false
  );

  if (gpaRecords.some((record) =>
    SPECIAL_GRADES.includes(record.grade)
  )) {
    return null;
  }

  let totalPoints = 0;
  let totalCredits = 0;

  for (const record of gpaRecords) {
    const points = GRADE_POINTS[record.grade];

    if (points === undefined) {
      continue;
    }

    totalPoints += record.credits * points;
    totalCredits += record.credits;
  }

  if (totalCredits === 0) {
    return null;
  }

  return roundGPA(totalPoints / totalCredits);
};

/**
 * Calculate weighted Cumulative Grade Point Average (CGPA).
 * Accepts academic records across semesters.
 */
export const calculateCGPA = (records) => {
  const gpaRecords = records.filter(
    (record) => record.countsForGPA !== false
  );

  if (gpaRecords.some((record) =>
    SPECIAL_GRADES.includes(record.grade)
  )) {
    return null;
  }

  let weightedPoints = 0;
  let weightedCredits = 0;

  for (const record of gpaRecords) {
    const points = GRADE_POINTS[record.grade];

    if (points === undefined) {
      continue;
    }

    const weight = getSemesterWeight(record.semester);

    weightedPoints += weight * record.credits * points;
    weightedCredits += weight * record.credits;
  }

  if (weightedCredits === 0) {
    return null;
  }

  return roundGPA(weightedPoints / weightedCredits);
};
