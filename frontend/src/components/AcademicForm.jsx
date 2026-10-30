
import { useState } from 'react'
import {
  createAcademicRecord,
  updateAcademicRecord,
} from '../api/academicApi'

const GPA_GRADES = [
  'A+', 'A', 'A-', 'B+', 'B', 'B-',
  'C+', 'C', 'C-', 'E',
]

const NON_GPA_GRADES = [
  'PASS-H', 'PASS-M', 'PASS-S', 'FAIL-E',
]

const SPECIAL_GRADES = ['MC', 'AC', 'WH']

const getInitialForm = (record) => ({
  moduleCode: record?.moduleCode || '',
  moduleName: record?.moduleName || '',
  credits: record?.credits ?? '',
  grade: record?.grade || '',
  countsForGPA: record?.countsForGPA ?? true,
  semester: record?.semester ?? '',
  academicYear: record?.academicYear || '',
})

function AcademicForm({
  recordToEdit = null,
  onRecordAdded,
  onRecordUpdated,
  onCancelEdit,
}) {
  const [formData, setFormData] = useState(
    () => getInitialForm(recordToEdit)
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const isEditing = Boolean(recordToEdit)

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'countsForGPA' ? { grade: '' } : {}),
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    const payload = {
      moduleCode: formData.moduleCode.trim().toUpperCase(),
      moduleName: formData.moduleName.trim(),
      credits: Number(formData.credits),
      grade: formData.grade || null,
      countsForGPA: formData.countsForGPA,
      semester: Number(formData.semester),
      academicYear: formData.academicYear.trim(),
    }

    setLoading(true)

    try {
      if (isEditing) {
        const updatedRecord = await updateAcademicRecord(
          recordToEdit._id,
          payload
        )
        await onRecordUpdated(updatedRecord)
      } else {
        const newRecord = await createAcademicRecord(payload)
        await onRecordAdded(newRecord)
        setFormData(getInitialForm(null))
        setSuccess('Academic module added successfully!')
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to save academic module.'
      )
    } finally {
      setLoading(false)
    }
  }

  const gradeOptions = formData.countsForGPA
    ? GPA_GRADES
    : NON_GPA_GRADES

  return (
    <section className="academic-form-card">
      <h2>
        {isEditing ? 'Edit Academic Module' : 'Add Academic Module'}
      </h2>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="module-code">Module Code</label>
        <input
          id="module-code"
          name="moduleCode"
          type="text"
          value={formData.moduleCode}
          onChange={handleChange}
          required
        />

        <label htmlFor="module-name">Module Name</label>
        <input
          id="module-name"
          name="moduleName"
          type="text"
          value={formData.moduleName}
          onChange={handleChange}
          required
        />

        <label htmlFor="module-credits">Credits</label>
        <input
          id="module-credits"
          name="credits"
          type="number"
          min="0.01"
          step="any"
          value={formData.credits}
          onChange={handleChange}
          required
        />

        <label htmlFor="module-semester">Semester</label>
        <select
          id="module-semester"
          name="semester"
          value={formData.semester}
          onChange={handleChange}
          required
        >
          <option value="">Select semester</option>
          {Array.from({ length: 8 }, (_, index) => (
            <option key={index + 1} value={index + 1}>
              Semester {index + 1}
            </option>
          ))}
        </select>

        <label htmlFor="academic-year">Academic Year</label>
        <input
          id="academic-year"
          name="academicYear"
          type="text"
          pattern="[0-9]{4}/[0-9]{4}"
          title="Enter academic year in YYYY/YYYY format"
          value={formData.academicYear}
          onChange={handleChange}
          required
        />

        <label className="academic-checkbox-label">
          <input
            type="checkbox"
            name="countsForGPA"
            checked={formData.countsForGPA}
            onChange={handleChange}
          />
          Counts towards GPA
        </label>

        <label htmlFor="module-grade">Grade</label>
        <select
          id="module-grade"
          name="grade"
          value={formData.grade}
          onChange={handleChange}
        >
          <option value="">Not assigned yet</option>

          {gradeOptions.map((grade) => (
            <option key={grade} value={grade}>
              {grade}
            </option>
          ))}

          {SPECIAL_GRADES.map((grade) => (
            <option key={grade} value={grade}>
              {grade}
            </option>
          ))}
        </select>

        {error && (
          <p role="alert" className="auth-error">
            {error}
          </p>
        )}

        {success && (
          <p role="status" className="task-success">
            {success}
          </p>
        )}

        <button
          type="submit"
          className="auth-button"
          disabled={loading}
        >
          {loading
            ? 'Saving...'
            : isEditing
              ? 'Update Module'
              : 'Add Module'}
        </button>

        {isEditing && (
          <button
            type="button"
            className="academic-cancel-button"
            onClick={onCancelEdit}
            disabled={loading}
          >
            Cancel Editing
          </button>
        )}
      </form>
    </section>
  )
}

export default AcademicForm
