import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const ordersAPI = {
  create: (order, token) => axios.post(`${API_URL}/orders`, order, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getByUser: (token) => axios.get(`${API_URL}/orders`, {
    headers: { Authorization: `Bearer ${token}` }
  })
}