import axios from "axios";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://mg-appstore-backend.onrender.com"
).replace(/\/+$/, "");

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json"
  }
});

// प्रत्येक API Request में उपलब्ध Login Token जोड़ें।
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("mg_appstore_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// API Error को एक समान तरीके से संभालें।
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Server से कनेक्शन नहीं हो पाया।";

    return Promise.reject({
      message,
      status: error.response?.status || 0,
      data: error.response?.data || null
    });
  }
);

export default api;
export { API_BASE_URL };
