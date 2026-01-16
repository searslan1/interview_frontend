/**
 * Enterprise Authentication Configuration (Frontend)
 * Mirrors backend auth.config.ts settings
 */

export const AUTH_CONFIG = {
    // Token Süreleri (Backend ile senkron)
    ACCESS_TOKEN_EXPIRY_MS: 15 * 60 * 1000,        // 15 dakika
    REFRESH_TOKEN_EXPIRY_MS: 30 * 24 * 60 * 60 * 1000,  // 30 gün
    
    // Proactive Refresh: Token'ın son 2 dakikasına girildiğinde yenile
    PROACTIVE_REFRESH_BUFFER_MS: 2 * 60 * 1000,    // 2 dakika
    
    // Background Heartbeat: Aktif kullanıcıları canlı tut
    HEARTBEAT_INTERVAL_MS: 5 * 60 * 1000,          // 5 dakika
    
    // Retry Configuration
    MAX_REFRESH_RETRIES: 3,
    RETRY_DELAY_MS: 1000,
    
    // Session Storage Keys
    STORAGE_KEYS: {
        TOKEN_EXPIRY: 'hireai_token_expiry',
        SESSION_ID: 'hireai_session_id',
        LAST_ACTIVITY: 'hireai_last_activity',
    },
} as const;

/**
 * Token expiry timestamp'i hesapla
 */
export const calculateTokenExpiry = (expiresInMs: number = AUTH_CONFIG.ACCESS_TOKEN_EXPIRY_MS): number => {
    return Date.now() + expiresInMs;
};

/**
 * Token'ın proaktif yenileme zamanına gelip gelmediğini kontrol et
 */
export const shouldProactivelyRefresh = (expiryTimestamp: number): boolean => {
    const now = Date.now();
    const timeUntilExpiry = expiryTimestamp - now;
    return timeUntilExpiry > 0 && timeUntilExpiry <= AUTH_CONFIG.PROACTIVE_REFRESH_BUFFER_MS;
};

/**
 * Token'ın expired olup olmadığını kontrol et
 */
export const isTokenExpired = (expiryTimestamp: number): boolean => {
    return Date.now() >= expiryTimestamp;
};

export default AUTH_CONFIG;
