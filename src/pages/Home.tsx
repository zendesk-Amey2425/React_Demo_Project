import { useCallback } from 'react';
import type { Task, FilterType } from '../types';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import FilterButtons from '../components/FilterButtons';

interface HomeProps {
  tasks: Task[];
  filter: FilterType;
  loading: boolean;
  onFilterChange: (filter: FilterType) => void;
  onAddTask: (text: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

/**
 * Home page — main task management interface.
 *
 * Key change from localStorage version:
 * - Tasks are already filtered by the API (server-side), so no client-side
 *   filtering needed. This keeps the component simpler and scales better.
 * - Loading state shows a spinner while the API responds
 */
export default function Home({
  tasks,
  filter,
  loading,
  onFilterChange,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}: HomeProps) {
  const handleToggle = useCallback((id: string) => {
    onToggleTask(id);
  }, [onToggleTask]);

  const handleDelete = useCallback((id: string) => {
    onDeleteTask(id);
  }, [onDeleteTask]);

  return (
    <div className="page-container">
      <div className="container">
        <h1 className="title">My Tasks</h1>
        <TaskForm onAddTask={onAddTask} />
        <FilterButtons currentFilter={filter} onFilterChange={onFilterChange} />

        {/* Show loading spinner only on initial load, not during optimistic updates */}
        {loading ? (
          <div className="loading-container">
            <div className="quote-spinner"></div>
            <p>Loading tasks...</p>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
