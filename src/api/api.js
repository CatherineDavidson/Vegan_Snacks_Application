import axios from "axios";

const api = axios.create({
  baseURL: "https://vegan-snacks.onrender.com/api", // your Spring Boot backend base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
