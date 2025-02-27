import axios from "axios";
import { useAuthStore } from "@/store/authStore";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_APP_URL,
    withCredentials: true, // ✅ Cookie tabanlı oturum yönetimi için gerekli
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// ✅ API isteği öncesinde ek ayarlamalar
api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ✅ API yanıtlarında hata yönetimi
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Eğer 401 hatası (Unauthorized) alındıysa ve daha önce denenmediyse
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => {
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                    await api.post('/auth/refresh');
                    processQueue(null);
                    return api(originalRequest);
     // ✅ Yeniden orijinal isteği dene
            } catch (refreshError) {
                processQueue(refreshError, null);
                const { logout } = useAuthStore.getState();
                logout(); // ✅ Kullanıcıyı çıkış yaptır
                window.location.href = "/";
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);
 export default api;