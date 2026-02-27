// API client for communicating with backend

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

console.log(`🔌 API Client configured for: ${API_URL}`)

interface ApiResponse<T> {
  data?: T
  error?: string
}

// Add a new record (income or expense)
export const addRecord = async (record: {
  type: 'income' | 'expense'
  amount: number
  date: string
}): Promise<ApiResponse<any>> => {
  try {
    console.log('📤 POST /add', record)
    const response = await fetch(`${API_URL}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('❌ Add record failed', error)
      return { error: error.error || 'Failed to add record' }
    }

    const data = await response.json()
    return { data }
  } catch (err) {
    console.error('🔴 Network error', err)
    return { error: 'Network error: Unable to reach backend' }
  }
}

// Fetch all records
export const fetchAll = async (): Promise<ApiResponse<any[]>> => {
  try {
    console.log('📤 GET /all')
    const response = await fetch(`${API_URL}/all`)
    if (!response.ok) {
      const error = await response.json()
      console.error('❌ Fetch all failed', error)
      return { error: error.error || 'Failed to fetch records' }
    }
    const data = await response.json()
    return { data }
  } catch (err) {
    console.error('🔴 Network error', err)
    return { error: 'Network error: Unable to reach backend' }
  }
}

// Delete a record
export const deleteRecord = async (id: string): Promise<ApiResponse<{ success: boolean; id: string }>> => {
  try {
    console.log('📤 DELETE /delete/' + id)
    const response = await fetch(`${API_URL}/delete/${id}`, { method: 'DELETE' })
    if (!response.ok) {
      const error = await response.json()
      console.error('❌ Delete failed', error)
      return { error: error.error || 'Failed to delete record' }
    }
    const data = await response.json()
    return { data }
  } catch (err) {
    console.error('🔴 Network error', err)
    return { error: 'Network error: Unable to reach backend' }
  }
}

// Summary totals
export const fetchSummary = async (): Promise<ApiResponse<{ income: number; expense: number; savings: number }>> => {
  try {
    console.log('📤 GET /summary')
    const response = await fetch(`${API_URL}/summary`)
    if (!response.ok) {
      const error = await response.json()
      console.error('❌ Summary failed', error)
      return { error: error.error || 'Failed to fetch summary' }
    }
    const data = await response.json()
    return { data }
  } catch (err) {
    console.error('🔴 Network error', err)
    return { error: 'Network error: Unable to reach backend' }
  }
}