/**
 * Auth Service Unit Tests
 * Tests for frontend authentication service
 */

import { authService } from '@/services/authService';
import api from '@/utils/api';
import { AUTH_CONFIG } from '@/lib/auth.config';

// Mock api
jest.mock('@/utils/api', () => ({
    __esModule: true,
    default: {
        get: jest.fn(),
        post: jest.fn(),
    },
}));

// Mock authStore
jest.mock('@/store/authStore', () => ({
    useAuthStore: {
        getState: () => ({
            logout: jest.fn(),
        }),
    },
}));

describe('authService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    describe('login', () => {
        it('should send login request and store token expiry', async () => {
            // Arrange
            const mockResponse = {
                data: {
                    data: {
                        user: { id: 'user123', email: 'test@example.com' },
                        expiresIn: 900, // 15 minutes
                    },
                },
            };
            (api.post as jest.Mock).mockResolvedValueOnce(mockResponse);

            // Act
            const result = await authService.login('test@example.com', 'password123');

            // Assert
            expect(api.post).toHaveBeenCalledWith('/auth/login', {
                email: 'test@example.com',
                password: 'password123',
            });
            expect(result).toEqual(mockResponse.data);
            
            const storedExpiry = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.TOKEN_EXPIRY);
            expect(storedExpiry).not.toBeNull();
        });

        it('should throw on login failure', async () => {
            // Arrange
            (api.post as jest.Mock).mockRejectedValueOnce(new Error('Invalid credentials'));

            // Act & Assert
            await expect(
                authService.login('test@example.com', 'wrong')
            ).rejects.toThrow('Invalid credentials');
        });
    });

    describe('refreshToken', () => {
        it('should refresh token and update stored expiry', async () => {
            // Arrange
            const mockResponse = {
                data: {
                    success: true,
                    data: {
                        expiresIn: 900,
                    },
                },
            };
            (api.post as jest.Mock).mockResolvedValueOnce(mockResponse);

            // Act
            const result = await authService.refreshToken();

            // Assert
            expect(api.post).toHaveBeenCalledWith('/auth/refresh');
            expect(result).toEqual(mockResponse.data);
            
            const storedExpiry = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.TOKEN_EXPIRY);
            expect(storedExpiry).not.toBeNull();
        });

        it('should throw on refresh failure', async () => {
            // Arrange
            (api.post as jest.Mock).mockRejectedValueOnce(new Error('Token expired'));

            // Act & Assert
            await expect(authService.refreshToken()).rejects.toThrow('Token expired');
        });
    });

    describe('logout', () => {
        it('should send logout request and clear stored data', async () => {
            // Arrange
            localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.TOKEN_EXPIRY, '12345');
            (api.post as jest.Mock).mockResolvedValueOnce({ data: { success: true } });

            // Act
            await authService.logout();

            // Assert
            expect(api.post).toHaveBeenCalledWith('/auth/logout');
            expect(localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.TOKEN_EXPIRY)).toBeNull();
        });

        it('should clear local data even if API fails', async () => {
            // Arrange
            localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.TOKEN_EXPIRY, '12345');
            (api.post as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

            // Act
            await authService.logout();

            // Assert
            expect(localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.TOKEN_EXPIRY)).toBeNull();
        });
    });

    describe('getCurrentUser', () => {
        it('should fetch current user profile', async () => {
            // Arrange
            const mockUser = { id: 'user123', email: 'test@example.com' };
            (api.get as jest.Mock).mockResolvedValueOnce({ 
                data: { data: mockUser } 
            });

            // Act
            const result = await authService.getCurrentUser();

            // Assert
            expect(api.get).toHaveBeenCalledWith('/profile/me');
            expect(result).toEqual(mockUser);
        });

        it('should return null on failure', async () => {
            // Arrange
            (api.get as jest.Mock).mockRejectedValueOnce(new Error('Unauthorized'));

            // Act
            const result = await authService.getCurrentUser();

            // Assert
            expect(result).toBeNull();
        });
    });

    describe('register', () => {
        it('should send registration request', async () => {
            // Arrange
            const registerData = {
                email: 'new@example.com',
                password: 'password123',
                name: 'New User',
            };
            const mockResponse = {
                data: { success: true },
            };
            (api.post as jest.Mock).mockResolvedValueOnce(mockResponse);

            // Act
            const result = await authService.register(registerData);

            // Assert
            expect(api.post).toHaveBeenCalledWith('/auth/register', registerData);
            expect(result).toBe(true);
        });
    });

    describe('verifyEmail', () => {
        it('should verify email with token', async () => {
            // Arrange
            (api.get as jest.Mock).mockResolvedValueOnce({ 
                data: { success: true } 
            });

            // Act
            const result = await authService.verifyEmail('token123');

            // Assert
            expect(api.get).toHaveBeenCalledWith('/auth/verify-email?token=token123');
            expect(result).toEqual({ success: true });
        });
    });

    describe('requestPasswordReset', () => {
        it('should send forgot password request', async () => {
            // Arrange
            (api.post as jest.Mock).mockResolvedValueOnce({ 
                data: { message: 'Email sent' } 
            });

            // Act
            const result = await authService.requestPasswordReset('test@example.com');

            // Assert
            expect(api.post).toHaveBeenCalledWith('/auth/forgot-password', {
                email: 'test@example.com',
            });
        });
    });

    describe('resetPassword', () => {
        it('should send reset password request', async () => {
            // Arrange
            (api.post as jest.Mock).mockResolvedValueOnce({ 
                data: { message: 'Password reset' } 
            });

            // Act
            const result = await authService.resetPassword('token123', 'newpassword');

            // Assert
            expect(api.post).toHaveBeenCalledWith('/auth/reset-password', {
                token: 'token123',
                newPassword: 'newpassword',
            });
        });
    });
});
