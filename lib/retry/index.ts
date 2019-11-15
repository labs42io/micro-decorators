import { Retryer } from './Retryer';
import { DEFAULT_OPTIONS, MethodOptions, RetryOptions } from './RetryOptions';
import { ScopeCounter } from './ScopeCounter';
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
    const scope = new ScopeCounter();

    descriptor.value = function () {
      const counter = scope.getCounter(this);

      let count = counter.get();

      const methodOptions: MethodOptions = {
        instance: this,
        args: arguments,
        method: target[propertyKey],
      };
      const retryer = new Retryer(retryOptions, methodOptions);

      try {
        let response = method.apply(this, arguments);
        const isPromiseLike = response && typeof response.then === 'function';

        if (isPromiseLike) {
          response = response.catch(err =>
            waitStrategy.wait(count)
              .then(() => {
                count = counter.next();
                return retryer.retry(err, attempts, count);
              }));
        }

        return response;
      } catch (err) {
        count = counter.next();
        return retryer.retry(err, attempts, count);
      }
    };

    return descriptor;
  };
}
