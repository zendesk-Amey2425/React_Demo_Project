# Development Guidelines

## Logging System

### Overview
The application uses a centralized logging utility (`src/utils/logger.ts`) for structured, consistent logging across the codebase.

### Log Levels

```typescript
logger.info()   // User actions, state changes (add/delete tasks)
logger.warn()   // Non-critical issues, deprecation warnings
logger.error()  // Exceptions, API failures, critical errors
logger.debug()  // Detailed diagnostic information (dev only)
```

### Usage Examples

```typescript
// Log user action with context
logger.info('Task added', { taskId: newTask.id, text: newTask.text });

// Log API call
logger.debug('Fetching data', { url });

// Log error with exception
logger.error('Failed to persist tasks', error, { count: tasks.length });
```

### Production Considerations

- **Development**: All logs except debug are visible in console
- **Production**: Logs should be sent to monitoring services (Sentry, LogRocket, etc.)
- **Performance**: Logging is lightweight; context objects are only stringified when needed
- **Privacy**: Never log sensitive user data (passwords, tokens, PII)

### Where We Log

✅ **Log these events:**
- Task operations (add, toggle, delete)
- API requests and responses
- LocalStorage operations (save/load)
- Error conditions and failures
- User-triggered refetch actions

❌ **Don't log:**
- Render cycles
- Simple state updates
- Obvious operations
- Sensitive user data

---

## Commenting Standards

### Philosophy
Comments explain **WHY**, not **WHAT**. The code itself shows what it does; comments provide context, rationale, and edge cases.

### When to Comment

✅ **Add comments for:**
- Complex business logic
- Non-obvious algorithms or calculations
- Edge case handling
- Integration points (APIs, external services)
- Performance optimizations
- Workarounds for browser bugs
- Security considerations
- Important state management patterns

❌ **Don't comment:**
- Self-explanatory code
- Simple variable assignments
- Standard patterns (map, filter, etc.)
- Type definitions (TypeScript handles this)

### Comment Styles

#### 1. Function/Component Documentation
```typescript
/**
 * Brief description of what the function does.
 * Explain complex behavior, params, and return values.
 */
export function myFunction() {
  // Implementation
}
```

#### 2. Inline Comments for Logic
```typescript
// Trim whitespace to prevent empty or whitespace-only tasks
const trimmed = input.trim();

// Avoid division by zero - show 0% when no tasks exist
const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
```

#### 3. Explaining Decisions
```typescript
/**
 * Track component mount status to prevent state updates after unmount.
 * This prevents "Can't perform a React state update on an unmounted component" warnings.
 */
let isMounted = true;
```

#### 4. Business Rules
```typescript
/**
 * Get the 5 most recently added tasks.
 * Reversed to show newest first.
 */
const recentTasks = useMemo(() => {
  return tasks.slice(-5).reverse();
}, [tasks]);
```

### Comment Density

- **Component files**: 5-10% of lines should be comments
- **Utility files**: 10-15% (more complex logic)
- **Hooks**: 10-15% (explain React-specific patterns)
- **Types**: Brief inline comments for non-obvious fields

### Examples from Codebase

**Good Comment** ✅
```typescript
// Avoid division by zero - show 0% when no tasks exist
const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
```

**Bad Comment** ❌
```typescript
// Calculate completion rate
const completionRate = Math.round((completed / total) * 100);
```

**Good Comment** ✅
```typescript
/**
 * Uses crypto.randomUUID() for collision-free IDs.
 * More reliable than Date.now() or incremental counters.
 */
```

**Bad Comment** ❌
```typescript
// Creates a new task
const newTask = { ... };
```

---

## Error Handling

### Strategy
- **Fail gracefully**: Don't crash the app; show error states
- **Log everything**: All errors go through logger for tracking
- **User feedback**: Display user-friendly error messages
- **Recovery**: Provide retry mechanisms where appropriate

### Examples

```typescript
try {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  logger.debug('Tasks persisted to localStorage', { count: tasks.length });
} catch (error) {
  // localStorage may be full or disabled in private browsing
  logger.error('Failed to persist tasks to localStorage', error);
}
```

---

## Code Review Checklist

Before submitting code, verify:

- [ ] All user actions are logged appropriately
- [ ] Complex logic has explanatory comments
- [ ] Error cases are handled and logged
- [ ] No console.log statements (use logger instead)
- [ ] Comments explain WHY, not WHAT
- [ ] No commented-out code (use git instead)
- [ ] All tests pass
- [ ] No TypeScript errors or warnings

---

## Future Improvements

### Logging Enhancements
- [ ] Integrate with Sentry or similar error tracking
- [ ] Add performance monitoring (Web Vitals)
- [ ] Implement log buffering for batch uploads
- [ ] Add user session tracking
- [ ] Create log filtering in production

### Documentation
- [ ] Add JSDoc for all public APIs
- [ ] Create component usage examples
- [ ] Document state management patterns
- [ ] Add architecture decision records (ADRs)
