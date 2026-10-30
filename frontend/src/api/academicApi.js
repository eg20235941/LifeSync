
import api from './axios'

const getAuthConfig = () => {
  const token = localStorage.getItem('lifesync_token')

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

// GET /api/academic
export const getAcademicRecords = async () => {
  const response = await api.get(
    '/academic',
    getAuthConfig()
  )

  return response.data.data.records
}

// GET /api/academic/:id
export const getAcademicRecordById = async (id) => {
  const response = await api.get(
    `/academic/${id}`,
    getAuthConfig()
  )

  return response.data.data.record
}

// POST /api/academic
export const createAcademicRecord = async (recordData) => {
  const response = await api.post(
    '/academic',
    recordData,
    getAuthConfig()
  )

  return response.data.data.record
}

// PUT /api/academic/:id
export const updateAcademicRecord = async (id, recordData) => {
  const response = await api.put(
    `/academic/${id}`,
    recordData,
    getAuthConfig()
  )

  return response.data.data.record
}

// DELETE /api/academic/:id
export const deleteAcademicRecord = async (id) => {
  const response = await api.delete(
    `/academic/${id}`,
    getAuthConfig()
  )

  return response.data
}

// GET /api/academic/gpa
export const getAcademicGPA = async () => {
  const response = await api.get(
    '/academic/gpa',
    getAuthConfig()
  )

  return response.data.data
}
