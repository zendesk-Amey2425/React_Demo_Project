/**
 * Centralized logging utility for the application.
 * Provides structured logging with different severity levels.
 * In production, this can be extended to send logs to external services (e.g., Sentry, LogRocket).
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;

  /**
   * Formats log messages with timestamp and context
   */
  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  /**
   * Log informational messages (user actions, state changes)
   */
  info(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.log(this.formatMessage('info', message, context));
    }
  }

  /**
   * Log warning messages (non-critical issues, deprecated usage)
   */
  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage('warn', message, context));
  }

  /**
   * Log error messages (exceptions, API failures, critical issues)
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext = error instanceof Error
      ? { ...context, error: error.message, stack: error.stack }
      : context;

    console.error(this.formatMessage('error', message, errorContext));

    // TODO: Send to error tracking service in production (e.g., Sentry)
  }

  /**
   * Log debug messages (detailed diagnostic information)
   * Only logged in development mode
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.debug(this.formatMessage('debug', message, context));
    }
  }
}

export const logger = new Logger();
