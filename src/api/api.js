const API = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

fetch(`${process.env.NEXT_PUBLIC_API_URL}/exam-start`)
  .then(response => response.json())
  .then(data => console.log(data));

// Add token if you are handling authentication
// API.interceptors.request.use((req) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     req.headers.Authorization = `Bearer ${token}`;
//   }
//   return req;
// });

export const fetchUsers = () => API.get('/api/users');
export const createUser = (userData) => API.post('/api/users', userData);
export const loginUser = (credentials) => API.post('/api/auth/login', credentials);
