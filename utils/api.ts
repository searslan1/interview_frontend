import axios, { AxiosError } from "axios";
import { useAuthStore } from "@/store/authStore";
import { AUTH_CONFIG, calculateTokenExpiry } from "@/lib/auth.config";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_APP_URL,
    withCredentials: true, // Cookie tabanlı oturum yönetimi için gerekli
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

// Refresh state management
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(undefined);
        }
    });
    failedQueue = [];
};

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Activity timestamp güncelle
        if (typeof window !== 'undefined') {
            localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString());
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - token refresh logic
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as typeof error.config & { _retry?: boolean };

        // 401 hatası ve henüz retry yapılmadıysa
        if (error.response?.status === 401 && !originalRequest?._retry) {
            // Refresh endpoint'i ise döngüyü engelle
            if (originalRequest?.url?.includes('/auth/refresh')) {
                handleLogout();
                return Promise.reject(error);
            }

            if (isRefreshing) {
                // Başka bir refresh devam ediyorsa kuyruğa ekle
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => {
                        return api(originalRequest!);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest!._retry = true;
            isRefreshing = true;

            try {
                const response = await api.post('/auth/refresh');
                
                // Token expiry'yi güncelle
                if (response.data?.data?.expiresIn && typeof window !== 'undefined') {
                    const expiry = calculateTokenExpiry(response.data.data.expiresIn);
                    localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.TOKEN_EXPIRY, expiry.toString());
                }
                
                processQueue(null);
                return api(originalRequest!);
            } catch (refreshError) {
                processQueue(refreshError as Error);
                handleLogout();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

/**
 * Handle logout on auth failure
 */
function handleLogout() {
    if (typeof window !== 'undefined') {
        // Clear storage
        localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.TOKEN_EXPIRY);
        localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.SESSION_ID);
        localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.LAST_ACTIVITY);
        
        // Clear auth store
        const { logout } = useAuthStore.getState();
        logout();
    }
}

export default api;