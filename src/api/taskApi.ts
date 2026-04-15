import apiClient from './client';
import type { Task, FilterType } from '../types';
import { logger } from '../utils/logger';

/**
 * Raw API response shapes — these match the Rails serializer output exactly.
 * Keeping them separate from the frontend Task type means the API contract
 * is documented in one place and easy to update if the backend changes.
 */
interface TaskResponse {
  id: string;
  text: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

interface TasksListResponse {
  tasks: TaskResponse[];
}

interface SingleTaskResponse {
  task: TaskResponse;
}

/**
 * Maps the API response (snake_case timestamps) to the frontend Task type.
 * This keeps API-specific details out of components.
 */
function toTask(raw: TaskResponse): Task {
  return {
    id: raw.id,
    text: raw.text,
    completed: raw.completed,
  };
}

/**
 * Task API service — all HTTP calls for task CRUD in one place.
 *
 * Why a service layer instead of calling axios in components?
 * - Components stay focused on UI, not HTTP details
 * - Easy to mock in tests (swap one import)
 * - API changes (URL, params, headers) only need updating here
 */
export const taskApi = {
  /**
   * Fetch tasks with optional filtering and pagination.
   * The backend returns tasks sorted by created_at DESC (newest first).
   */
  async getAll(filter: FilterType = 'all'): Promise<Task[]> {
    const params: Record<string, string> = {};

    // Only send filter param when it's not 'all' — avoids unnecessary query param
    if (filter !== 'all') {
      params.filter = filter;
    }

    const response = await apiClient.get<TasksListResponse>('/tasks', { params });
    logger.info('Tasks fetched', { count: response.data.tasks.length, filter });
    return response.data.tasks.map(toTask);
  },

  /**
   * Create a new task. The backend generates the UUID and timestamps.
   * Returns the created task with its server-assigned ID.
   */
  async create(text: string): Promise<Task> {
    const response = await apiClient.post<SingleTaskResponse>('/tasks', {
      task: { text },
    });
    logger.info('Task created via API', { taskId: response.data.task.id });
    return toTask(response.data.task);
  },

  /**
   * Toggle a task's completed status.
   * Sends only the fields that changed — PATCH semantics.
   */
  async toggleComplete(id: string, completed: boolean): Promise<Task> {
    const response = await apiClient.patch<SingleTaskResponse>(`/tasks/${id}`, {
      task: { completed },
    });
    logger.info('Task toggled via API', { taskId: id, completed });
    return toTask(response.data.task);
  },

  /**
   * Update a task's text.
   */
  async updateText(id: string, text: string): Promise<Task> {
    const response = await apiClient.patch<SingleTaskResponse>(`/tasks/${id}`, {
      task: { text },
    });
    logger.info('Task text updated via API', { taskId: id });
    return toTask(response.data.task);
  },

  /**
   * Permanently delete a task. Returns nothing (204 No Content from backend).
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
    logger.info('Task deleted via API', { taskId: id });
  },
};
