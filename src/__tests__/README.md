# Test Suite Documentation

## Directory Structure

```
src/__tests__/
├── App.test.tsx                    # Main app integration tests
├── components/
│   ├── TaskForm.test.tsx          # Form component tests
│   └── TaskList.test.tsx          # List component tests
├── pages/
│   ├── Home.test.tsx              # Home page tests
│   └── Stats.test.tsx             # Statistics page tests
└── hooks/
    └── useFetch.test.ts           # Custom hook tests
```

## Test Coverage

### App.test.tsx (5 tests)
- ✅ Adding new tasks
- ✅ Toggling task completion status
- ✅ Deleting tasks
- ✅ Persisting tasks to localStorage
- ✅ Loading tasks from localStorage on mount

### TaskForm.test.tsx (4 tests)
- ✅ Submitting with valid input
- ✅ Clearing input after submission
- ✅ Preventing empty/whitespace submissions
- ✅ Submitting with Enter key

### TaskList.test.tsx (2 tests)
- ✅ Rendering all tasks
- ✅ Showing empty state message

### Home.test.tsx (4 tests)
- ✅ Filtering all tasks
- ✅ Filtering active tasks
- ✅ Filtering completed tasks
- ✅ Changing filter via buttons

### Stats.test.tsx (5 tests)
- ✅ Calculating mixed statistics (60% completion)
- ✅ Handling all completed tasks (100%)
- ✅ Handling empty state (0%)
- ✅ Displaying recent tasks in reverse order
- ✅ Limiting recent tasks to 5

### useFetch.test.ts (4 tests)
- ✅ Successful API fetch
- ✅ HTTP error handling (404)
- ✅ Network error handling
- ✅ Refetch functionality

## Running Tests

```bash
# Run all tests once
npm test

# Watch mode (run tests on file changes)
npm test -- --watch

# UI mode (visual test runner)
npm run test:ui

# Coverage report
npm run test:coverage
```

## Testing Standards

- **Location**: All tests are in `src/__tests__/` directory
- **Naming**: `*.test.tsx` or `*.test.ts` files
- **Structure**: Mirrors the `src/` directory structure
- **Framework**: Vitest + React Testing Library
- **Focus**: Tests validate user behavior, not implementation details
