import { render, screen } from '@testing-library/react';
import TaskList from '../../components/TaskList';
import type { Task } from '../../types';

describe('TaskList', () => {
  const mockTasks: Task[] = [
    { id: '1', text: 'Task 1', completed: false },
    { id: '2', text: 'Task 2', completed: true },
  ];

  it('renders all tasks', () => {
    render(<TaskList tasks={mockTasks} onToggle={jest.fn()} onDelete={jest.fn()} />);

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('shows empty message when no tasks', () => {
    render(<TaskList tasks={[]} onToggle={jest.fn()} onDelete={jest.fn()} />);

    expect(screen.getByText(/no tasks to display/i)).toBeInTheDocument();
  });
});
