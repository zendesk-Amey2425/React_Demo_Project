import type { FilterType } from '../types';

interface FilterButtonsProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

/**
 * Filter button group component.
 * Allows users to switch between viewing all, active, or completed tasks.
 */
export default function FilterButtons({ currentFilter, onFilterChange }: FilterButtonsProps) {
  /**
   * Available filter options.
   * Defined as array for maintainability and easy addition of new filters.
   */
  const filters: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
  ];

  return (
    <div className="filter-buttons">
      {filters.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => onFilterChange(value)}
          className={currentFilter === value ? 'filter-button active' : 'filter-button'}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
