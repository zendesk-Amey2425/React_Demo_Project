/**
 * Core task data structure.
 * Represents a single task item with unique identifier and completion status.
 */
export interface Task {
  id: string;        // Unique identifier (generated via crypto.randomUUID())
  text: string;      // User-entered task description
  completed: boolean; // Task completion status
}

/**
 * Available filter types for task list view.
 * - 'all': Show all tasks regardless of status
 * - 'active': Show only incomplete tasks
 * - 'completed': Show only completed tasks
 */
export type FilterType = 'all' | 'active' | 'completed';
