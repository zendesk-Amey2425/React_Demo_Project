import type { Task } from '../types';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * Task list container component.
 * Renders a list of tasks or an empty state message.
 */
export default function TaskList({ tasks, onToggle, onDelete }: TaskListProps) {
  // Show friendly message when no tasks match the current filter
  if (tasks.length === 0) {
    return <p className="empty-message">No tasks to display</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
