import { Retryer } from './Retryer';
import { DEFAULT_OPTIONS, MethodOptions, RetryOptions } from './RetryOptions';
import { WaitStrategy } from './WaitStrategy';

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
    const retryOptions = { ...DEFAULT_OPTIONS, ...options };
    const waitStrategy = new WaitStrategy(retryOptions.waitPattern);

    let retryCount: number = 0;

    descriptor.value = function () {
      const methodOptions: MethodOptions = {
        instance: this,
        args: arguments,
        method: target[propertyKey],
      };
      const retryer = new Retryer(retryOptions, methodOptions);

      try {
        const response = method.apply(this, arguments);
        const isPromiseLike = response && typeof response.then === 'function';

        if (isPromiseLike) {
          return response.catch((err) => {
            retryCount += 1;

            return waitStrategy.wait(retryCount - 1)
              .then(() => retryer.retry(err, attempts, retryCount));
          });
        }

        return response;
      } catch (err) {
        retryCount += 1;
        return retryer.retry(err, attempts, retryCount);
      }
    };

    return descriptor;
  };
}
