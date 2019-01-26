import {
  ThrottleOptions,
  DEFAULT_INTERVAL,
  DEFAULT_SCOPE,
  DEFAULT_ON_ERROR,
} from './ThrottleOptions';
import { createScope } from './scopes';

export { ThrottleOptions };

/**
 * Limits the number of executions of a method within a given interval of time.
 * When the limit is exceeded the method is immediately
 * rejected with `Throttle limit exceeded.` error (configurable, see `options.behavior`).
 * @param limit the max number of executions within an interval of time (see `options.interval`).
 * @param options (optional) additional options,
 * defaults to {interval: 'second', scope: 'args-hash', error: 'throw'}
 */
export function throttle(
  limit: number,
  options?: ThrottleOptions) {

  return function (target: any, propertyKey: any, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    const raise = raiseStrategy(options);
    const scope = createScope(
      options && options.scope || DEFAULT_SCOPE,
      limit,
      calculateInterval(options));

    descriptor.value = function () {
      const throttler = scope.throttler(this, Array.from(arguments));
      if (!throttler.pass()) {
        return raise(new Error('Throttle limit exceeded.'));
      }

      return method.apply(this, arguments);
    };
  };
}

function raiseStrategy(options: ThrottleOptions) {
  const value = options && options.onError || DEFAULT_ON_ERROR;

  switch (value) {
    case 'reject':
      return err => Promise.reject(err);
    case 'throw':
      return (err) => { throw err; };
    case 'ignore':
      return () => { };
    case 'ignoreAsync':
      return () => Promise.resolve();
    default:
      throw new Error(`Option ${value} is not supported for 'behavior'.`);
  }
}

function calculateInterval(options: ThrottleOptions) {
  const value = options && options.interval || DEFAULT_INTERVAL;

  switch (value) {
    case 'minute':
      return 60000;
    case 'second':
      return 1000;
    default:
      <number>value;
  }
}
