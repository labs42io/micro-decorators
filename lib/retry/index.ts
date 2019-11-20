import { Retryer } from './Retryer';
import { DEFAULT_OPTIONS, RetryOptions } from './RetryOptions';

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

    descriptor.value = function () {
      const args = arguments;
      const retryer = new Retryer(options, () => method.apply(this, args), this, attempts);

      return retryer.getResponse();
    };

    return descriptor;
  };
}
