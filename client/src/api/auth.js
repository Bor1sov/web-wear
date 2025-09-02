import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const authAPI = {
  login: (email, password) => 
    axios.post(`${API_URL}/auth/login`, { email, password }).then(res => res.data),
  register: (userData) => 
    axios.post(`${API_URL}/auth/register`, userData).then(res => res.data),
  verifyToken: (token) => 
    axios.get(`${API_URL}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.data)
}