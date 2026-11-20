import axios from 'axios'

export const api = axios.create({
  baseURL: '/api/admin',
  withCredentials: true,
  headers: {
    Accept: 'application/json'
  },
})