// Jest setup file
import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        prefetch: jest.fn(),
        back: jest.fn(),
    }),
    usePathname: () => '/dashboard',
    useSearchParams: () => new URLSearchParams(),
}));

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => {
            store[key] = value;
        },
        removeItem: (key) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

// Mock window.addEventListener for storage events
const originalAddEventListener = window.addEventListener;
const originalRemoveEventListener = window.removeEventListener;

window.addEventListener = jest.fn((event, handler) => {
    if (event === 'storage' || event === 'visibilitychange') {
        return;
    }
    return originalAddEventListener.call(window, event, handler);
});

window.removeEventListener = jest.fn((event, handler) => {
    if (event === 'storage' || event === 'visibilitychange') {
        return;
    }
    return originalRemoveEventListener.call(window, event, handler);
});

// Mock document.visibilityState
Object.defineProperty(document, 'visibilityState', {
    writable: true,
    value: 'visible',
});
