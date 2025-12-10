import axios from "axios";

const api = axios.create({
  // baseURL: "http://django_backend:8000/api", // docker!!!
  baseURL: "http://localhost:8000/api", // local!!!
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
