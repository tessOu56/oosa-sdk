export * from './ApiClient';
export * from './types';
export * from './errors';
export * from './cache';

// 創建默認實例
import { ApiClient } from './ApiClient';
import { ApiClientConfig } from './types';

export const createApiClient = (config: ApiClientConfig) => {
  return new ApiClient(config);
}; 