import apiClient from './client';
import { logger } from '../utils/logger';

/**
 * Quote shape from ZenQuotes API (proxied through our Rails backend).
 */
export interface Quote {
  q: string; // Quote text
  a: string; // Author name
  h: string; // HTML-formatted quote
}

/**
 * Fetch a random motivational quote.
 *
 * The request goes: Frontend → Rails API → ZenQuotes
 * Rails caches the response for 10 minutes, so repeated calls are fast
 * and don't hammer the upstream API.
 *
 * @param force - when true, tells the backend to skip cache and fetch a fresh quote.
 *   Pass true when the user clicks the refresh button, false on normal page load.
 */
export async function fetchRandomQuote(force = false): Promise<Quote> {
  const params = force ? { force: 'true' } : {};
  const response = await apiClient.get<Quote[]>('/quotes/random', { params });

  if (response.data && response.data.length > 0) {
    logger.info('Quote fetched', { author: response.data[0].a });
    return response.data[0];
  }

  throw { code: 'empty_response', message: 'No quote returned', details: {}, status: 200 };
}
