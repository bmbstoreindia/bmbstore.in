import axios from "axios";
import { showApiLoader, hideApiLoader } from "../utils/app.store";

let activeRequests = 0;
// const apiUrl = import.meta.env.MODE === 'prod' ? import.meta.env.VITE_API_PROD_URL : import.meta.env.VITE_API_LOCAL_URL

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_PROD_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
 
axiosInstance.interceptors.request.use(
  (config) => {
    activeRequests++;
    showApiLoader();

    const token = localStorage.getItem("token"); // change key if needed

    if (token) {
      // ✅ Axios v1: headers can be AxiosHeaders (has .set)
      if (config.headers && typeof (config.headers as any).set === "function") {
        (config.headers as any).set("Authorization", `Bearer ${token}`);
      } else {
        // ✅ fallback for plain object headers
        (config.headers as any) = {
          ...(config.headers as any),
          Authorization: `Bearer ${token}`,
        };
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    activeRequests = Math.max(0, activeRequests - 1);
    if (activeRequests === 0) hideApiLoader();
    return response;
  },
  (error) => {
    activeRequests = Math.max(0, activeRequests - 1);
    if (activeRequests === 0) hideApiLoader();
    return Promise.reject(error);
  }
);

export default axiosInstance;
