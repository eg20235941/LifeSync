
function AcademicRecordsTable({
  records,
  semesters = [],
  onEdit,
  onDelete,
  busyRecordId,
}) {
  const semesterNumbers = [...new Set(
    records.map((record) => record.semester)
  )].sort((a, b) => a - b)

  const getSemesterGPA = (semester) => {
    return semesters.find(
      (item) => item.semester === semester
    )?.sgpa
  }

  if (records.length === 0) {
    return (
      <section className="academic-records-section">
        <h2>Academic Records</h2>
        <p>No academic modules added yet.</p>
      </section>
    )
  }

  return (
    <section className="academic-records-section">
      <h2>Academic Records</h2>

      {semesterNumbers.map((semester) => {
        const semesterRecords = records
          .filter((record) => record.semester === semester)
          .sort((a, b) =>
            a.moduleCode.localeCompare(b.moduleCode)
          )

        const sgpa = getSemesterGPA(semester)

        return (
          <div
            className="academic-semester-group"
            key={semester}
          >
            <div className="academic-records-header">
              <h3>Semester {semester}</h3>
              <span>
                SGPA: {sgpa == null
                  ? 'N/A'
                  : Number(sgpa).toFixed(2)}
              </span>
            </div>

            <div className="academic-table-wrapper">
              <table className="academic-records-table">
                <thead>
                  <tr>
                    <th>Module</th>
                    <th>Credits</th>
                    <th>Grade</th>
                    <th>GPA</th>
                    <th>Academic Year</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {semesterRecords.map((record) => (
                    <tr key={record._id}>
                      <td>
                        <strong>{record.moduleCode}</strong>
                        <small>{record.moduleName}</small>
                      </td>

                      <td>{record.credits}</td>

                      <td>
                        <span className="academic-grade">
                          {record.grade || 'Pending'}
                        </span>
                      </td>

                      <td>
                        {record.countsForGPA
                          ? 'Yes'
                          : 'No'}
                      </td>

                      <td>{record.academicYear}</td>
                      <td>
  <div className="academic-record-actions">
    <button
      type="button"
      disabled={busyRecordId === record._id}
      onClick={() => onEdit(record)}
    >
      Edit
    </button>

    <button
      type="button"
      className="academic-delete-button"
      disabled={busyRecordId === record._id}
      onClick={() => onDelete(record)}
    >
      Delete
    </button>
  </div>
</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}
    </section>
  )
}

export default AcademicRecordsTable
