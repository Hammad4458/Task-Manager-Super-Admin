import axios from "axios";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

export const api = axios.create({
    baseURL: "http://localhost:3001", 
    withCredentials: true, // Ensure cookies are sent with requests
});

// Request interceptor to include the access token in the header
api.interceptors.request.use(
    (config) => {
        const token = cookies.get("token"); // Access token from cookies

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle expired access token and refresh it
api.interceptors.response.use(
    (response) => {
        // If the backend sends a new access token, store it in cookies
        if (response.data.access_token) {
            cookies.set("token", response.data.access_token, { path: "/", sameSite: "lax" });
        }

        // If the backend sends a new refresh token, store it in cookies (important for refreshing)
        if (response.data.refresh_token) {
            cookies.set("refresh_token", response.data.refresh_token, { path: "/", sameSite: "lax" });
        }
        
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If the error is a 401 and we haven't tried refreshing the token yet
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Send the refresh token to the backend to get a new access token
                const refresh_token = cookies.get("refresh_token"); // Store refresh token in a secure cookie

                const response = await axios.post("http://localhost:3001/super-admin/refresh-token", {
                    refresh_token,
                });

                if (response.data.access_token) {
                    // Update access token in cookies
                    cookies.set("token", response.data.access_token, { path: "/", sameSite: "lax" });

                    // Update refresh token in cookies (if the backend sends a new refresh token)
                    if (response.data.refresh_token) {
                        cookies.set("refresh_token", response.data.refresh_token, { path: "/", sameSite: "lax" });
                    }

                    // Reattempt the original request with the new access token
                    originalRequest.headers["Authorization"] = `Bearer ${response.data.access_token}`;
                    return axios(originalRequest);
                }
            } catch (refreshError) {
                cookies.remove("token");
                cookies.remove("refresh_token");
                window.location.href = "/login"; // Redirect to login if refreshing fails
            }
        }

        return Promise.reject(error);
    }
);
