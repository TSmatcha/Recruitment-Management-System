import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Gắn token tự động vào mọi request
api.interceptors.request.use((config) => {
  // Lấy trực tiếp từ sessionStorage để đảm bảo tính độc lập giữa các tab
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;