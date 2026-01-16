/**
 * Auth Store Unit Tests
 * Tests for Zustand auth state management
 */

import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { AUTH_CONFIG } from '@/lib/auth.config';

// Mock authService
jest.mock('@/services/authService', () => ({
    authService: {
        getCurrentUser: jest.fn(),
        login: jest.fn(),
        logout: jest.fn(),
        register: jest.fn(),
        refreshToken: jest.fn(),
        verifyEmail: jest.fn(),
        requestPasswordReset: jest.fn(),
        resetPassword: jest.fn(),
    },
}));

describe('authStore', () => {
    beforeEach(() => {
        // Reset store state
        useAuthStore.setState({
            user: null,
            userPreferences: null,
            isLoading: false,
            error: null,
            isEmailVerified: false,
            isInitialized: false,
        });
        
        // Clear mocks
        jest.clearAllMocks();
        localStorage.clear();
    });

    describe('initialize', () => {
        it('should initialize with user from getCurrentUser', async () => {
            // Arrange
            const mockUser = {
                _id: 'user123',
                email: 'test@example.com',
                firstName: 'Test',
                lastName: 'User',
                emailVerified: true,
                preferences: { theme: 'dark' },
            };
            (authService.getCurrentUser as jest.Mock).mockResolvedValueOnce(mockUser);

            // Act
            await useAuthStore.getState().initialize();

            // Assert
            const state = useAuthStore.getState();
            expect(state.isInitialized).toBe(true);
            expect(state.user).toEqual(mockUser);
            expect(state.isEmailVerified).toBe(true);
            expect(state.userPreferences).toEqual({ theme: 'dark' });
        });

        it('should handle failed initialization gracefully', async () => {
            // Arrange
            (authService.getCurrentUser as jest.Mock).mockRejectedValueOnce(new Error('Unauthorized'));

            // Act
            await useAuthStore.getState().initialize();

            // Assert
            const state = useAuthStore.getState();
            expect(state.isInitialized).toBe(true);
            expect(state.user).toBeNull();
        });

        it('should not reinitialize if already initialized', async () => {
            // Arrange
            useAuthStore.setState({ isInitialized: true });

            // Act
            await useAuthStore.getState().initialize();

            // Assert
            expect(authService.getCurrentUser).not.toHaveBeenCalled();
        });
    });

    describe('setUser', () => {
        it('should set user and extract preferences', () => {
            // Arrange
            const mockUser = {
                _id: 'user123',
                email: 'test@example.com',
                emailVerified: true,
                preferences: { theme: 'light' },
            };

            // Act
            useAuthStore.getState().setUser(mockUser as any);

            // Assert
            const state = useAuthStore.getState();
            expect(state.user).toEqual(mockUser);
            expect(state.isEmailVerified).toBe(true);
            expect(state.userPreferences).toEqual({ theme: 'light' });
        });

        it('should set null user', () => {
            // Arrange
            useAuthStore.setState({
                user: { _id: 'user123' } as any,
            });

            // Act
            useAuthStore.getState().setUser(null);

            // Assert
            expect(useAuthStore.getState().user).toBeNull();
        });
    });

    describe('login', () => {
        it('should login user and fetch profile', async () => {
            // Arrange
            const mockUser = {
                _id: 'user123',
                email: 'test@example.com',
                emailVerified: true,
            };
            (authService.login as jest.Mock).mockResolvedValueOnce({ 
                data: { expiresIn: 900 } 
            });
            (authService.getCurrentUser as jest.Mock).mockResolvedValueOnce(mockUser);

            // Act
            await useAuthStore.getState().login('test@example.com', 'password123');

            // Assert
            const state = useAuthStore.getState();
            expect(state.user).toEqual(mockUser);
            expect(state.isLoading).toBe(false);
            expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
        });

        it('should set error on login failure', async () => {
            // Arrange
            (authService.login as jest.Mock).mockRejectedValueOnce({
                response: { data: { message: 'Invalid credentials' } }
            });

            // Act
            await useAuthStore.getState().login('test@example.com', 'wrong');

            // Assert
            const state = useAuthStore.getState();
            expect(state.user).toBeNull();
            expect(state.isLoading).toBe(false);
            expect(state.error).toBe('Invalid credentials');
        });
    });

    describe('logout', () => {
        it('should clear user state on logout', () => {
            // Arrange
            useAuthStore.setState({
                user: { _id: 'user123' } as any,
                isEmailVerified: true,
            });
            localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.TOKEN_EXPIRY, '12345');

            // Act
            useAuthStore.getState().logout();

            // Assert
            const state = useAuthStore.getState();
            expect(state.user).toBeNull();
            expect(state.isEmailVerified).toBe(false);
        });

        it('should clear localStorage on logout', () => {
            // Arrange
            useAuthStore.setState({
                user: { _id: 'user123' } as any,
            });
            localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.SESSION_ID, 'session123');

            // Act
            useAuthStore.getState().logout();

            // Assert
            expect(localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.SESSION_ID)).toBeNull();
        });
    });

    describe('register', () => {
        it('should register user successfully', async () => {
            // Arrange
            (authService.register as jest.Mock).mockResolvedValueOnce(true);

            // Act
            const result = await useAuthStore.getState().register({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
            });

            // Assert
            expect(result).toBe(true);
            expect(authService.register).toHaveBeenCalledWith({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
            });
        });
    });

    describe('verifyEmail', () => {
        it('should verify email with token', async () => {
            // Arrange
            (authService.verifyEmail as jest.Mock).mockResolvedValueOnce({ success: true });

            // Act
            await useAuthStore.getState().verifyEmail('token123');

            // Assert
            const state = useAuthStore.getState();
            expect(state.isEmailVerified).toBe(true);
        });
    });

    describe('refreshToken', () => {
        it('should refresh token successfully', async () => {
            // Arrange
            (authService.refreshToken as jest.Mock).mockResolvedValueOnce({ success: true });

            // Act
            await useAuthStore.getState().refreshToken();

            // Assert
            expect(authService.refreshToken).toHaveBeenCalled();
        });
    });

    describe('requestPasswordReset', () => {
        it('should send password reset request', async () => {
            // Arrange
            (authService.requestPasswordReset as jest.Mock).mockResolvedValueOnce({ success: true });

            // Act
            await useAuthStore.getState().requestPasswordReset('test@example.com');

            // Assert
            expect(authService.requestPasswordReset).toHaveBeenCalledWith('test@example.com');
        });
    });

    describe('resetPassword', () => {
        it('should reset password with token', async () => {
            // Arrange
            (authService.resetPassword as jest.Mock).mockResolvedValueOnce({ success: true });

            // Act
            await useAuthStore.getState().resetPassword('token123', 'newpassword');

            // Assert
            expect(authService.resetPassword).toHaveBeenCalledWith('token123', 'newpassword');
        });
    });
});
