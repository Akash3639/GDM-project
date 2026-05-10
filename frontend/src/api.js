import axios from "axios";

const isLocalHost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
const inferredHost = isLocalHost ? "localhost" : window.location.hostname;
const protocol = window.location.protocol === "https:" ? "https:" : "http:";
const inferredBase = `${protocol}//${inferredHost}:8000`;
const API_BASE = import.meta.env.VITE_API_BASE_URL || inferredBase;
const api = axios.create({ baseURL: API_BASE });

export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => localStorage.getItem("token");
export const getApiBase = () => API_BASE;

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Retry once with localhost/127.0.0.1 fallback for local dev network quirks.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config;
    const isNetworkError = error?.code === "ERR_NETWORK";
    const alreadyRetried = config?._retriedWithHostFallback;
    if (!config || !isNetworkError || alreadyRetried) {
      return Promise.reject(error);
    }

    const base = config.baseURL || API_BASE;
    let fallbackBase = "";
    if (base.includes("localhost:8000")) fallbackBase = base.replace("localhost:8000", "127.0.0.1:8000");
    if (base.includes("127.0.0.1:8000")) fallbackBase = base.replace("127.0.0.1:8000", "localhost:8000");
    if (!fallbackBase) return Promise.reject(error);

    config._retriedWithHostFallback = true;
    config.baseURL = fallbackBase;
    return api.request(config);
  }
);

export default api;
