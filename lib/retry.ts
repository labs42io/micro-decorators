import { raiseStrategy } from './utils';

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
  waitPattern?: WaitPattern,
};

type WaitPattern = number | number[] | ((attempt: number) => number);

/**
 * Retries the execution of a method for a given number of attempts.
 * If the method fails to succeed after `attempts` retries, it fails
 * with error `Retry failed.`
 * @param attempts max number of attempts to retry execution
 * @param options (optional) retry options
 */
export function retry(attempts: number, options?: RetryOptions): any {
  return function (target: any, propertyKey: any, descriptor: PropertyDescriptor) {
    const method: Function = descriptor.value;
    const defaultOptions: RetryOptions = {
      errorFilter: () => { return true; },
    };
    const retryOptions = {
      ...defaultOptions,
      ...options,
    };

    let attemptIndex = 1;

    descriptor.value = function () {
      return method.apply(this, arguments)
        .then((result) => {
          return result;
        })
        .catch(async (error) => {
          const shouldRetry = attemptIndex < attempts && retryOptions.errorFilter(error);

          if (shouldRetry) {
            if (retryOptions.waitPattern) {
              await waitByStrategy(attemptIndex, retryOptions.waitPattern);
            }
            attemptIndex += 1;
            return target[propertyKey]();
          }

          const raise = raiseStrategy({ onError: retryOptions.onError }, 'throw');
          return raise(new Error('Retry failed.'));
        });
    };

    return descriptor;
  };
}

function waitByStrategy(attemptIndex: number, waitPattern: WaitPattern): Promise<void> {
  const isPatternTypeArray = Array.isArray(waitPattern);
  const patternType = isPatternTypeArray ? 'array' : typeof waitPattern;

  switch (patternType) {
    case 'number':
      return wait(waitPattern as number);
    case 'array':
      const attemptValues = waitPattern as number[];
      const shouldWaitValue = attemptIndex > attemptValues.length
        ? attemptValues[attemptValues.length - 1]
        : attemptValues[attemptIndex];

      return wait(shouldWaitValue);
    case 'function':
      return wait((waitPattern as Function)(attemptIndex));
    default:
      throw new Error(`Option ${patternType} is not supported for 'waitPattern'.`);
  }
}

function wait(timeout: number = 0): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, timeout));
}
