
/**
 * Retries the execution of a method for a given number of attempts.
 * If the method fails to succeed after `attempts` retries, it fails
 * with error `Retry failed.`
 * @param attempts max number of attempts to retry execution
 * @param timeout (optional) the number of milliseconds to wait before making new attempt.
 * When no value is provided, retries immediately.
 */
export function retry(attempts: number, timeout?: number);

/**
 * Retries the execution of a method for a given number of attempts.
 * If the method fails to succeed after `attempts` retries, it fails
 * with error `Retry failed.`
 * @param attempts max number of attempts to retry execution
 * @param pattern an array of timeouts in milliseconds to wait between each attempt.
 * When the length of the array is less then the number of attempts,
 * then last array value is used for the remaining attempts.
 */
export function retry(attempts: number, pattern?: number[]);

export function retry(attempts: number, timeoutOrPattern?: number | number[]): any {
  throw new Error('Not implemented.');
}
