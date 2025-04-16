import '@testing-library/jest-dom';
import { vi, beforeEach } from 'vitest';

declare global {
  interface Window {
    fetch: typeof fetch;
  }
  var axios: any;
}

// Mock fetch and axios
global.fetch = vi.fn();
global.axios = vi.fn();

// Mock console methods to keep test output clean
console.error = vi.fn();
console.warn = vi.fn();
console.log = vi.fn();

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
}); 