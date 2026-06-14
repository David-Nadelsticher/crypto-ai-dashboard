import axios from "axios";
import { dispatchAuthExpired } from "../utils/authEvents";

const TOKEN_KEY = "access_token";
const USER_KEY = "user";

const PUBLIC_PATHS = ["/login", "/signup"];

const AUTH_ENDPOINTS = ["/login", "/signup"];

function isAuthEndpoint(url) {
  const requestPath = url?.split("?")[0] ?? "";
  return AUTH_ENDPOINTS.some(
    (path) => requestPath === path || requestPath.endsWith(path),
  );
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const requestPath = config.url?.split("?")[0] ?? "";
  const isPublicPath = PUBLIC_PATHS.some(
    (path) => requestPath === path || requestPath.endsWith(path),
  );

  if (!isPublicPath) {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const hadToken = Boolean(localStorage.getItem(TOKEN_KEY));

      if (!isAuthEndpoint(error.config?.url) && hadToken) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        dispatchAuthExpired();
      }
    }
    return Promise.reject(error);
  },
);

export { TOKEN_KEY };
export default api;
