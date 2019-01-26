export type RetryOptions = {
  /**
   * Sets the behavior of handling the case when all retrials failed.
   * When `throw` (default) then throws immediately with an error.
   * When `reject` then returns a rejected promise with an error.
   * When `ignore` then doesn't throw any error and immediately
   * terminates execution (returns undefined).
   * When `ignoreAsync` then doesn't throw any error and immediately
   * returns a resolved promise.
   */
  onError?: 'throw' | 'reject' | 'ignore' | 'ignoreAsync',

  /**
   * Allows to filter only for specific errors.
   * By default all errors are retried.
   */
  errorFilter?: (err: Error) => boolean,

  /**
   * Allows to delay a retry execution. By default when `waitPattern` is not specified
   * then a failing method is retried immediately.
   * A number is used as a milliseconds interval to wait until next attempt.
   * An array is used to apply timeouts between attempts according to array values
   * (in milliseconds). Last array value is used in case array length is less than
   * number of attempts.
   * A custom function can be used to provide custom interval (in milliseconds)
   * based on attempt number (indexed from one).
   */
  waitPattern?: number | number[] | ((attempt: number) => number),
};

/**
 * Retries the execution of a method for a given number of attempts.
 * If the method fails to succeed after `attempts` retries, it fails
 * with error `Retry failed.`
 * @param attempts max number of attempts to retry execution
 * @param options (optional) retry options
 */
export function retry(attempts: number, options?: number): any {
  throw new Error('Not implemented.');
}
