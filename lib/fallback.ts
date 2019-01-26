export type FallbackOptions = {
  /**
   * Allows to filter only for specific errors.
   * By default all errors are handled.
   */
  errorFilter?: (err: Error) => boolean,
};

/**
 * Allows to provide a substitute value when method call fails or rejects.
 * @param options optional fallback options
 */
export function fallback(valueProvider: (...args: any[]) => any, options?: FallbackOptions);
export function fallback(value: any, options?: FallbackOptions) {
  throw new Error('Not implemented.');
}
