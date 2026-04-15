import apiClient from './client';
import type { Task } from '../types';
import { logger } from '../utils/logger';

/**
 * Stats response shape from GET /api/v1/stats.
 * Matches the Rails StatsController output exactly.
 */
export interface StatsResponse {
  total_count: number;
  completed_count: number;
  active_count: number;
  completion_rate: number;
  recent_tasks: {
    id: string;
    text: string;
    completed: boolean;
    created_at: string;
    updated_at: string;
  }[];
}

/**
 * Frontend-friendly stats shape with camelCase keys.
 * Components use this — never the raw API response.
 */
export interface Stats {
  total: number;
  completed: number;
  active: number;
  completionRate: number;
  recentTasks: Task[];
}

/**
 * Fetch computed stats from the backend.
 *
 * Why fetch stats from the API instead of computing client-side?
 * - The backend uses SQL COUNT (O(1) with indexes) instead of loading all tasks
 * - As the task list grows, client-side computation becomes expensive
 * - Stats stay accurate even if multiple clients modify tasks
 */
export async function fetchStats(): Promise<Stats> {
  const response = await apiClient.get<StatsResponse>('/stats');
  const data = response.data;

  logger.info('Stats fetched', { total: data.total_count });

  return {
    total: data.total_count,
    completed: data.completed_count,
    active: data.active_count,
    completionRate: data.completion_rate,
    recentTasks: data.recent_tasks.map((t) => ({
      id: t.id,
      text: t.text,
      completed: t.completed,
    })),
  };
}
