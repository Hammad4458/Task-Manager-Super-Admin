import axios from "axios";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

export const api = axios.create({
    baseURL: "http://localhost:3001",
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const token = cookies.get("token"); 

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => {
        if (response.data.access_token) {
            cookies.set("token", response.data.access_token, { path: "/", sameSite: "lax" });
        }
        return response;
    },
    (error) => {
        console.error("Axios Error:", error.response);
        return Promise.reject(error);
    }
);
