import axios from 'axios'
import type { NarrativeResponse } from '../../../types/types'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

export async function getNarrative() {
  try {
    const response = await api.get<NarrativeResponse>('/narrative')
    return response.data
  } catch (error) {
    console.error('Error fetching narrative:', error)
    throw error
  }
}
