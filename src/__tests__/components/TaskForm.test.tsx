import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from '../../components/TaskForm';

describe('TaskForm', () => {
  it('calls onAddTask with trimmed input when submitted', async () => {
    const user = userEvent.setup();
    const mockAddTask = jest.fn();
    render(<TaskForm onAddTask={mockAddTask} />);

    const input = screen.getByPlaceholderText(/add a new task/i);
    await user.type(input, 'New task');
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(mockAddTask).toHaveBeenCalledWith('New task');
    expect(mockAddTask).toHaveBeenCalledTimes(1);
  });

  it('clears input after successful submission', async () => {
    const user = userEvent.setup();
    const mockAddTask = jest.fn();
    render(<TaskForm onAddTask={mockAddTask} />);

    const input = screen.getByPlaceholderText(/add a new task/i) as HTMLInputElement;
    await user.type(input, 'Task to clear');
    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(input.value).toBe('');
  });

  it('does not submit when input is empty or only whitespace', async () => {
    const user = userEvent.setup();
    const mockAddTask = jest.fn();
    render(<TaskForm onAddTask={mockAddTask} />);

    const addButton = screen.getByRole('button', { name: /add/i });

    await user.click(addButton);
    expect(mockAddTask).not.toHaveBeenCalled();

    await user.type(screen.getByPlaceholderText(/add a new task/i), '   ');
    await user.click(addButton);
    expect(mockAddTask).not.toHaveBeenCalled();
  });

  it('submits with Enter key', async () => {
    const user = userEvent.setup();
    const mockAddTask = jest.fn();
    render(<TaskForm onAddTask={mockAddTask} />);

    const input = screen.getByPlaceholderText(/add a new task/i);
    await user.type(input, 'Task via enter{Enter}');

    expect(mockAddTask).toHaveBeenCalledWith('Task via enter');
  });
});
