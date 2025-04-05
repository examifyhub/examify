const API = axios.create({ baseURL: process.env.REACT_APP_API_URL });


fetch('http://localhost:5000/exam-start')
  .then(response => response.json())
  .then(data => console.log(data));

export const fetchUsers = () => API.get('/api/users');
export const createUser = (userData) => API.post('/api/users', userData);
export const loginUser = (credentials) => API.post('/api/auth/login', credentials);
