// lnov/logger/makeLogger.ts

/**
 * **Logger Factory**
 *
 * Creates a simple logger utility with methods for different log levels.
 *
 * **Available Methods:**
 * - `info(message: string)`: Logs an informational message.
 * - `warn(message: string)`: Logs a warning message.
 * - `error(message: string)`: Logs an error message.
 *
 * @returns An object containing the logger methods.
 *
 * @example
 * ```typescript
 * const logger = makeLogger();
 * logger.info('Application started.');
 * logger.warn('Low disk space.');
 * logger.error('Unhandled exception occurred.');
 * ```
 *
 * @see {@link Logger}
 * @category Logger
 */
export default function makeLogger() {
  return {
    /**
     * Logs an informational message.
     *
     * @param message - The message to log.
     */
    info: (message: string): void => {
      console.log(`INFO: ${message}`);
    },
    /**
     * Logs a warning message.
     *
     * @param message - The message to log.
     */
    warn: (message: string): void => {
      console.warn(`WARN: ${message}`);
    },
    /**
     * Logs an error message.
     *
     * @param message - The message to log.
     */
    error: (message: string): void => {
      console.error(`ERROR: ${message}`);
    },
  };
}
