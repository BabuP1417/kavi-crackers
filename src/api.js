import axios from 'axios';


const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'https://kavi-backend-64wb.onrender.com/api' });


export function setAuthToken(token) {
if (token) API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
else delete API.defaults.headers.common['Authorization'];
}


export default API;