import { DEFAULT_ERROR, DEFAULT_ON_ERROR, RetryOptions } from './retry/RetryOptions';
import { waitStrategy } from './retry/WaitStrategy';
import { raiseStrategy } from './utils';

export { RetryOptions };

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
              await waitStrategy(attemptIndex, retryOptions.waitPattern);
            }
            attemptIndex += 1;
            return target[propertyKey]();
          }

          const raise = raiseStrategy({ onError: retryOptions.onError }, DEFAULT_ON_ERROR);
          return raise(new Error(DEFAULT_ERROR));
        });
    };

    return descriptor;
  };
}
