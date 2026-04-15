import { useState } from 'react';

interface TaskFormProps {
  onAddTask: (text: string) => void;
}

/**
 * Task input form component.
 * Handles task creation with validation to prevent empty submissions.
 */
export default function TaskForm({ onAddTask }: TaskFormProps) {
  const [input, setInput] = useState('');

  /**
   * Handle form submission.
   * Validates input and resets form after successful submission.
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Trim whitespace to prevent empty or whitespace-only tasks
    const trimmed = input.trim();

    if (trimmed) {
      onAddTask(trimmed);
      setInput(''); // Clear input after successful submission
    }
    // Silently ignore empty submissions (no error message needed for better UX)
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a new task..."
        className="task-input"
      />
      <button type="submit" className="add-button">
        Add
      </button>
    </form>
  );
}
