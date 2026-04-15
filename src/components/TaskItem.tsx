import type { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * Individual task item component.
 * Displays a task with checkbox for completion and delete button.
 */
export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <li className="task-item">
      <label className="task-label">
        {/* Checkbox for toggling task completion */}
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="task-checkbox"
        />
        {/* Apply 'completed' class for visual strikethrough effect */}
        <span className={task.completed ? 'task-text completed' : 'task-text'}>
          {task.text}
        </span>
      </label>
      {/* Delete button - permanent action with no undo */}
      <button
        onClick={() => onDelete(task.id)}
        className="delete-button"
        aria-label="Delete task"
      >
        ×
      </button>
    </li>
  );
}
