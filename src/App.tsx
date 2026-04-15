import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import type { Task, FilterType } from './types';
import { taskApi } from './api';
import type { ApiError } from './api';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Stats from './pages/Stats';
import { logger } from './utils/logger';
import './App.css';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');

  // Loading state prevents the UI from showing "No tasks" before the API responds
  const [loading, setLoading] = useState(true);

  // Global error state for API failures — shown as a banner, not a crash
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch tasks from the Rails API on mount and whenever the filter changes.
   *
   * Why fetch on filter change instead of filtering client-side?
   * - Scales better: the DB handles filtering with indexed queries
   * - Consistent: multiple browser tabs always show the same data
   * - For small task lists the difference is negligible, but this approach
   *   doesn't break down as the dataset grows
   */
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskApi.getAll(filter);
      setTasks(data);
      logger.info('Tasks loaded from API', { count: data.length, filter });
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.message || 'Failed to load tasks');
      logger.error('Failed to fetch tasks', err as Error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  /**
   * Add a new task via the API.
   *
   * Uses optimistic update pattern:
   * 1. Immediately add the task to local state (fast UI)
   * 2. Send the POST request in background
   * 3. Replace the optimistic entry with the server response (real UUID + timestamps)
   * 4. If the request fails, roll back and show an error
   */
  const addTask = useCallback(async (text: string) => {
    // Temporary ID for optimistic rendering — replaced by server ID on success
    const tempId = crypto.randomUUID();
    const optimisticTask: Task = { id: tempId, text, completed: false };

    setTasks((prev) => [optimisticTask, ...prev]);

    try {
      const createdTask = await taskApi.create(text);

      // Swap the temp task with the real one from the server
      setTasks((prev) =>
        prev.map((t) => (t.id === tempId ? createdTask : t))
      );
      logger.info('Task added', { taskId: createdTask.id });
    } catch (err) {
      // Roll back the optimistic add
      setTasks((prev) => prev.filter((t) => t.id !== tempId));
      const apiErr = err as ApiError;
      setError(apiErr.message || 'Failed to create task');
      logger.error('Failed to create task', err as Error);
    }
  }, []);

  /**
   * Toggle task completion via the API.
   *
   * Optimistic update: flip the checkbox immediately, revert if API fails.
   * This makes toggles feel instant even on slow connections.
   */
  const toggleTask = useCallback(async (id: string) => {
    // Find current state to know what to send and to enable rollback
    const taskToToggle = tasks.find((t) => t.id === id);
    if (!taskToToggle) return;

    const newCompleted = !taskToToggle.completed;

    // Optimistic: update UI immediately
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: newCompleted } : t))
    );

    try {
      await taskApi.toggleComplete(id, newCompleted);
      logger.info('Task toggled', { taskId: id, completed: newCompleted });
    } catch (err) {
      // Revert on failure
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !newCompleted } : t))
      );
      const apiErr = err as ApiError;
      setError(apiErr.message || 'Failed to update task');
      logger.error('Failed to toggle task', err as Error);
    }
  }, [tasks]);

  /**
   * Delete a task via the API.
   *
   * Optimistic: remove from UI immediately, re-add if the delete fails.
   */
  const deleteTask = useCallback(async (id: string) => {
    const taskToDelete = tasks.find((t) => t.id === id);
    if (!taskToDelete) return;

    // Optimistic: remove from UI immediately
    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      await taskApi.delete(id);
      logger.info('Task deleted', { taskId: id });
    } catch (err) {
      // Revert: put the task back in its original position
      setTasks((prev) => [taskToDelete, ...prev]);
      const apiErr = err as ApiError;
      setError(apiErr.message || 'Failed to delete task');
      logger.error('Failed to delete task', err as Error);
    }
  }, [tasks]);

  return (
    <BrowserRouter>
      <div className="app">
        <Navigation />

        {/* Global error banner — dismissible, sits above page content */}
        {error && (
          <div className="error-banner" role="alert">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="error-dismiss" aria-label="Dismiss error">
              &times;
            </button>
          </div>
        )}

        <Routes>
          <Route
            path="/"
            element={
              <Home
                tasks={tasks}
                filter={filter}
                loading={loading}
                onFilterChange={setFilter}
                onAddTask={addTask}
                onToggleTask={toggleTask}
                onDeleteTask={deleteTask}
              />
            }
          />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
