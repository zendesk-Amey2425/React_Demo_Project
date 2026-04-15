/**
 * Barrel export for the API layer.
 * Components import from 'api/' instead of reaching into individual files.
 */
export { taskApi } from './taskApi';
export { fetchStats } from './statsApi';
export { fetchRandomQuote } from './quotesApi';
export type { Stats, StatsResponse } from './statsApi';
export type { Quote } from './quotesApi';
export type { ApiError } from './client';
