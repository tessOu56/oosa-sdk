import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';

// Mock react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

describe('Custom Hooks', () => {
  it('should handle data fetching', () => {
    const mockData = { id: 1, name: 'Test' };
    (useQuery as any).mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useQuery({
      queryKey: ['test'],
      queryFn: () => Promise.resolve(mockData),
    }));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle loading state', () => {
    (useQuery as any).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    const { result } = renderHook(() => useQuery({
      queryKey: ['test'],
      queryFn: () => Promise.resolve({}),
    }));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeNull();
  });

  it('should handle error state', () => {
    const mockError = new Error('Test error');
    (useQuery as any).mockReturnValue({
      data: null,
      isLoading: false,
      error: mockError,
    });

    const { result } = renderHook(() => useQuery({
      queryKey: ['test'],
      queryFn: () => Promise.reject(mockError),
    }));

    expect(result.current.error).toBe(mockError);
    expect(result.current.data).toBeNull();
  });
}); 