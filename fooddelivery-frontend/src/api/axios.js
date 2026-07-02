import axios from "axios";

const API = axios.create({
  // Dynamically uses environment variable VITE_API_URL or defaults to localhost in development
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
});

export default API;