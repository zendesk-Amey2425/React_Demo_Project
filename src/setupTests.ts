import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

/**
 * Global test setup and cleanup.
 * Runs after each test to ensure test isolation.
 */
afterEach(() => {
  cleanup(); // Clean up React components
  localStorage.clear(); // Clear localStorage to prevent test pollution
});
