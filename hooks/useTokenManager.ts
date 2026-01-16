"use client";

import { useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { 
    AUTH_CONFIG, 
    calculateTokenExpiry, 
    shouldProactivelyRefresh, 
    isTokenExpired 
} from '@/lib/auth.config';

/**
 * Enterprise Token Manager Hook
 * 
 * Google-like session management:
 * - Proactive refresh: Access token bitmeden 2 dk önce yenile
 * - Silent refresh: Kullanıcı farkına varmadan token yenileme
 * - Tab synchronization: Tüm tab'larda oturum senkronizasyonu
 * - Activity tracking: Kullanıcı aktivitesine göre session yönetimi
 */
export function useTokenManager() {
    const { user, logout, setUser } = useAuthStore();
    const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
    const heartbeatTimerRef = useRef<NodeJS.Timeout | null>(null);
    const isRefreshingRef = useRef(false);
    const tokenExpiryRef = useRef<number>(0);

    /**
     * Silent token refresh
     */
    const silentRefresh = useCallback(async (): Promise<boolean> => {
        if (isRefreshingRef.current) {
            console.log('🔄 Refresh already in progress, skipping...');
            return false;
        }

        isRefreshingRef.current = true;

        try {
            console.log('🔄 Silent token refresh started...');
            const response = await authService.refreshToken();
            
            if (response) {
                // Yeni expiry timestamp kaydet
                const newExpiry = calculateTokenExpiry(response.expiresIn || AUTH_CONFIG.ACCESS_TOKEN_EXPIRY_MS);
                tokenExpiryRef.current = newExpiry;
                
                // LocalStorage'a kaydet (tab sync için)
                if (typeof window !== 'undefined') {
                    localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.TOKEN_EXPIRY, newExpiry.toString());
                    localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString());
                }
                
                // Sonraki proactive refresh'i schedule et
                scheduleProactiveRefresh(newExpiry);
                
                console.log('✅ Silent token refresh successful');
                return true;
            }
            return false;
        } catch (error) {
            console.error('❌ Silent token refresh failed:', error);
            
            // 401 hatası - oturumu sonlandır
            handleSessionExpired();
            return false;
        } finally {
            isRefreshingRef.current = false;
        }
    }, []);

    /**
     * Proactive refresh scheduling
     * Token bitmeden 2 dk önce otomatik yenileme
     */
    const scheduleProactiveRefresh = useCallback((expiryTimestamp: number) => {
        // Mevcut timer'ı temizle
        if (refreshTimerRef.current) {
            clearTimeout(refreshTimerRef.current);
        }

        const now = Date.now();
        const refreshTime = expiryTimestamp - AUTH_CONFIG.PROACTIVE_REFRESH_BUFFER_MS;
        const delay = Math.max(0, refreshTime - now);

        if (delay > 0) {
            console.log(`⏰ Scheduling proactive refresh in ${Math.round(delay / 1000)}s`);
            refreshTimerRef.current = setTimeout(() => {
                silentRefresh();
            }, delay);
        } else if (!isTokenExpired(expiryTimestamp)) {
            // Token henüz geçerli ama refresh zamanı geçmiş, hemen yenile
            silentRefresh();
        }
    }, [silentRefresh]);

    /**
     * Session expired handler
     */
    const handleSessionExpired = useCallback(() => {
        console.log('🔒 Session expired, logging out...');
        
        // Timer'ları temizle
        if (refreshTimerRef.current) {
            clearTimeout(refreshTimerRef.current);
        }
        if (heartbeatTimerRef.current) {
            clearInterval(heartbeatTimerRef.current);
        }
        
        // LocalStorage'ı temizle
        if (typeof window !== 'undefined') {
            localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.TOKEN_EXPIRY);
            localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.SESSION_ID);
            localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.LAST_ACTIVITY);
        }
        
        logout();
    }, [logout]);

    /**
     * Tab synchronization via storage event
     */
    const handleStorageChange = useCallback((event: StorageEvent) => {
        if (event.key === AUTH_CONFIG.STORAGE_KEYS.TOKEN_EXPIRY && event.newValue) {
            const newExpiry = parseInt(event.newValue, 10);
            if (!isNaN(newExpiry) && newExpiry !== tokenExpiryRef.current) {
                console.log('🔄 Token synced from another tab');
                tokenExpiryRef.current = newExpiry;
                scheduleProactiveRefresh(newExpiry);
            }
        }
        
        // Logout detection from another tab
        if (event.key === AUTH_CONFIG.STORAGE_KEYS.TOKEN_EXPIRY && event.newValue === null) {
            console.log('🔒 Logout detected from another tab');
            handleSessionExpired();
        }
    }, [scheduleProactiveRefresh, handleSessionExpired]);

    /**
     * Activity heartbeat - keeps session alive
     */
    const startHeartbeat = useCallback(() => {
        if (heartbeatTimerRef.current) {
            clearInterval(heartbeatTimerRef.current);
        }

        heartbeatTimerRef.current = setInterval(() => {
            if (typeof window !== 'undefined') {
                localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString());
            }
        }, AUTH_CONFIG.HEARTBEAT_INTERVAL_MS);
    }, []);

    /**
     * Initialize token manager
     */
    useEffect(() => {
        if (!user) {
            // Cleanup when user logs out
            if (refreshTimerRef.current) {
                clearTimeout(refreshTimerRef.current);
            }
            if (heartbeatTimerRef.current) {
                clearInterval(heartbeatTimerRef.current);
            }
            return;
        }

        // Storage event listener for tab sync
        window.addEventListener('storage', handleStorageChange);

        // Check existing token expiry from storage
        const storedExpiry = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.TOKEN_EXPIRY);
        if (storedExpiry) {
            const expiry = parseInt(storedExpiry, 10);
            if (!isNaN(expiry)) {
                tokenExpiryRef.current = expiry;
                
                if (isTokenExpired(expiry)) {
                    // Token expired, try to refresh
                    silentRefresh();
                } else if (shouldProactivelyRefresh(expiry)) {
                    // In proactive refresh window
                    silentRefresh();
                } else {
                    // Schedule proactive refresh
                    scheduleProactiveRefresh(expiry);
                }
            }
        } else {
            // No stored expiry, set initial
            const initialExpiry = calculateTokenExpiry();
            tokenExpiryRef.current = initialExpiry;
            localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.TOKEN_EXPIRY, initialExpiry.toString());
            scheduleProactiveRefresh(initialExpiry);
        }

        // Start heartbeat
        startHeartbeat();

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            if (refreshTimerRef.current) {
                clearTimeout(refreshTimerRef.current);
            }
            if (heartbeatTimerRef.current) {
                clearInterval(heartbeatTimerRef.current);
            }
        };
    }, [user, handleStorageChange, silentRefresh, scheduleProactiveRefresh, startHeartbeat]);

    /**
     * Visibility change handler - refresh when tab becomes visible
     */
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && user) {
                const storedExpiry = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.TOKEN_EXPIRY);
                if (storedExpiry) {
                    const expiry = parseInt(storedExpiry, 10);
                    if (!isNaN(expiry) && (isTokenExpired(expiry) || shouldProactivelyRefresh(expiry))) {
                        console.log('👁️ Tab became visible, checking token...');
                        silentRefresh();
                    }
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [user, silentRefresh]);

    return {
        silentRefresh,
        handleSessionExpired,
    };
}

export default useTokenManager;
