"use client";

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useTokenManager } from '@/hooks/useTokenManager';

interface AuthProviderProps {
    children: React.ReactNode;
}

/**
 * Auth Provider Component
 * 
 * Handles:
 * - Auth state initialization on app load
 * - Token manager for proactive refresh
 * - Session synchronization across tabs
 */
export function AuthProvider({ children }: AuthProviderProps) {
    const { initialize, isInitialized, user } = useAuthStore();
    
    // Initialize token manager for logged-in users
    useTokenManager();
    
    // Initialize auth state on mount
    useEffect(() => {
        if (!isInitialized) {
            initialize();
        }
    }, [initialize, isInitialized]);

    return <>{children}</>;
}

export default AuthProvider;
