
import { useEffect, useState } from 'react'
import {
  getAcademicRecords,
  getAcademicGPA,
  deleteAcademicRecord,
} from '../api/academicApi'
import AcademicForm from '../components/AcademicForm'
import AcademicRecordsTable from '../components/AcademicRecordsTable'
import './Academic.css'


function Academic() {
  const [records, setRecords] = useState([])
  const [gpaData, setGpaData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [editingRecord, setEditingRecord] = useState(null)
const [busyRecordId, setBusyRecordId] = useState(null)
const [actionError, setActionError] = useState('')

  useEffect(() => {
    const fetchAcademicData = async () => {
      try {
        const [recordsData, gpaResponse] = await Promise.all([
          getAcademicRecords(),
          getAcademicGPA(),
        ])

        setRecords(recordsData)
        setGpaData(gpaResponse)
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'Failed to load academic information.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchAcademicData()
  }, [])

const refreshGPA = async () => {
  try {
    const updatedGPA = await getAcademicGPA()
    setGpaData(updatedGPA)
  } catch {
    setActionError(
      'Record saved, but GPA could not be refreshed. Refresh the page to retry.'
    )
  }
}

const handleRecordAdded = async (newRecord) => {
  setActionError('')
  setRecords((previous) => [...previous, newRecord])
  await refreshGPA()
}

const handleRecordUpdated = async (updatedRecord) => {
  setActionError('')

  setRecords((previous) =>
    previous.map((record) =>
      record._id === updatedRecord._id
        ? updatedRecord
        : record
    )
  )

  setEditingRecord(null)
  await refreshGPA()
}

const handleDelete = async (record) => {
  const confirmed = window.confirm(
    `Delete module "${record.moduleCode} - ${record.moduleName}"?`
  )

  if (!confirmed) return

  setActionError('')
  setBusyRecordId(record._id)

  try {
    await deleteAcademicRecord(record._id)

    setRecords((previous) =>
      previous.filter((item) => item._id !== record._id)
    )

    if (editingRecord?._id === record._id) {
      setEditingRecord(null)
    }

    await refreshGPA()
  } catch (err) {
    setActionError(
      err.response?.data?.message ||
        'Failed to delete academic module.'
    )
  } finally {
    setBusyRecordId(null)
  }
}

  return (
    <div className="academic-page">

      {/* Page heading */}

      <section className="academic-page-heading">
        <div>
          <h1>Academic Hub</h1>
          <p>
            Track your modules, monitor your grades and manage your GPA.
          </p>
        </div>

        <div className="academic-heading-tag">
          ✦ &nbsp; Academic Workspace
        </div>
      </section>

      {loading && (
        <p>Loading academic information...</p>
      )}

      {error && (
        <p role="alert" className="auth-error">
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className="academic-overview">

          {/* Academic summary */}

          <h2>Academic Overview</h2>

          <div className="academic-summary-grid">

            <div className="academic-summary-card">
              <h3>Total Modules</h3>
              <strong>{records.length}</strong>
            </div>

            <div className="academic-summary-card">
              <h3>Overall CGPA</h3>
              <strong>
                {gpaData?.cgpa == null
                  ? 'N/A'
                  : Number(gpaData.cgpa).toFixed(2)}
              </strong>
            </div>

            <div className="academic-summary-card">
              <h3>Semesters</h3>
              <strong>
                {gpaData?.semesters?.length ?? 0}
              </strong>
            </div>

          </div>

          {gpaData?.provisional && (
            <p className="academic-notice">
              GPA is provisional because some grades
              have not been entered.
            </p>
          )}

          {gpaData?.cgpa == null && records.length > 0 && (
            <p className="academic-notice">
              CGPA is not currently available.
              Check pending or special grades.
            </p>
          )}

          {/* Semester GPA */}

          <h2>Semester GPA</h2>

          {gpaData?.semesters?.length ? (
            <div className="academic-semester-list">
              {gpaData.semesters.map((item) => (
                <div
                  className="academic-semester-item"
                  key={item.semester}
                >
                  <span>Semester {item.semester}</span>

                  <strong>
                    {item.sgpa == null
                      ? 'N/A'
                      : Number(item.sgpa).toFixed(2)}
                  </strong>
                </div>
              ))}
            </div>
          ) : (
            <p>No academic records available yet.</p>
          )}

          {actionError && (
            <p role="alert" className="auth-error">
              {actionError}
            </p>
          )}

          {/* Academic records */}

          <AcademicRecordsTable
            records={records}
            semesters={gpaData?.semesters || []}
            onEdit={(record) => {
              setActionError('')
              setEditingRecord(record)
            }}
            onDelete={handleDelete}
            busyRecordId={busyRecordId}
          />

          {/* Add or edit module */}

          <AcademicForm
            key={editingRecord?._id || 'new'}
            recordToEdit={editingRecord}
            onRecordAdded={handleRecordAdded}
            onRecordUpdated={handleRecordUpdated}
            onCancelEdit={() => setEditingRecord(null)}
          />

        </div>
      )}
    </div>
  )
}

export default Academic