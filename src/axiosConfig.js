const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5000' 
  : 'https://your-deployed-backend-url.com';

export default API_BASE_URL;
