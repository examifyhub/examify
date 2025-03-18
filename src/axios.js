import axios from 'axios';
import API_BASE_URL from './axiosConfig';

axios.post(`${API_BASE_URL}/api/login`, { username, password });
