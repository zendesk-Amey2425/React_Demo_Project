import axios from 'axios';
import { logger } from '../utils/logger';

/**
 * Central Axios instance for all API calls.
 *
 * Why a dedicated instance instead of using axios directly?
 * - Single place to set base URL, headers, and timeouts
 * - Request/response interceptors for logging and error normalization
 * - Easy to swap base URL between dev (proxy) and production (real domain)
 */
const apiClient = axios.create({
  // In dev, Vite proxies /api to http://localhost:3000.
  // In production, set VITE_API_BASE_URL to the real API domain.
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10s — fail fast rather than leave the UI hanging
});

/**
 * REQUEST INTERCEPTOR
 * Logs every outgoing request for debugging and audit trails.
 * In production, this feeds into observability tools (Datadog, Sentry, etc.)
 */
apiClient.interceptors.request.use(
  (config) => {
    logger.debug('API Request', {
      method: config.method?.toUpperCase(),
      url: config.url,
      params: config.params,
    });
    return config;
  },
  (error) => {
    logger.error('API Request setup failed', error);
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR
 * - Logs successful responses with status and timing info
 * - Normalizes error responses into a consistent shape so components
 *   don't need to handle raw Axios errors or check response.data.error
 */
apiClient.interceptors.response.use(
  (response) => {
    logger.debug('API Response', {
      status: response.status,
      url: response.config.url,
    });
    return response;
  },
  (error) => {
    if (axios.isCancel(error)) {
      // Request was intentionally cancelled (e.g., component unmount) — not an error
      logger.debug('API Request cancelled', { url: error.config?.url });
      return Promise.reject(error);
    }

    // Extract the structured error from our Rails API ({ error: { code, message, details } })
    // or fall back to a generic message for network failures
    const apiError = error.response?.data?.error;
    const normalizedError = {
      code: apiError?.code || 'network_error',
      message: apiError?.message || error.message || 'Network request failed',
      details: apiError?.details || {},
      status: error.response?.status || 0,
    };

    logger.error('API Error', error, {
      status: normalizedError.status,
      code: normalizedError.code,
      url: error.config?.url,
    });

    return Promise.reject(normalizedError);
  }
);

export default apiClient;

/**
 * Normalized error shape that all catch blocks receive.
 * Components can rely on this consistent structure instead of
 * checking for different error formats.
 */
export interface ApiError {
  code: string;
  message: string;
  details: Record<string, string[]>;
  status: number;
}
