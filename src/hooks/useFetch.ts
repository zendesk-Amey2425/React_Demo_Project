import { useState, useEffect, useCallback } from 'react';
import { logger } from '../utils/logger';

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook for fetching data from APIs.
 * Handles loading states, errors, and cleanup to prevent memory leaks.
 *
 * @param url - API endpoint to fetch from
 * @returns Object containing data, loading state, error, and refetch function
 */
export function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Trigger key to force refetch.
   * Incrementing this value causes useEffect to re-run.
   */
  const [refreshKey, setRefreshKey] = useState(0);

  /**
   * Manually trigger a data refetch.
   * Useful for retry buttons or pull-to-refresh functionality.
   */
  const refetch = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
    logger.info('Refetch triggered', { url });
  }, [url]);

  useEffect(() => {
    /**
     * Track component mount status to prevent state updates after unmount.
     * This prevents "Can't perform a React state update on an unmounted component" warnings.
     */
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        logger.debug('Fetching data', { url });
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (isMounted) {
          setData(result);
          setError(null);
          logger.info('Fetch successful', { url, dataType: typeof result });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';

        if (isMounted) {
          setError(errorMessage);
          setData(null);
          logger.error('Fetch failed', err, { url });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    /**
     * Cleanup function to prevent state updates after unmount.
     */
    return () => {
      isMounted = false;
    };
  }, [url, refreshKey]);

  return { data, loading, error, refetch };
}
