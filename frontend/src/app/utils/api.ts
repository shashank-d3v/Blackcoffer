import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api',  // ✅ not relative
});

export default API;
