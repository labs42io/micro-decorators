import {
  BulkheadOptions,
  DEFAULT_SCOPE,
  DEFAULT_ON_ERROR,
} from './BulkheadOptions';
import { createScope } from './scopes';
import { raiseStrategy } from '../utils';

export { BulkheadOptions };

/**
 * Limits the number of queued concurrent executions of a method.
 * When the limit is reached the execution is delayed and queued.
 * @param threshold the max number of concurrent executions.
 * @param options (optional) additional options,
 * defaults to {scope: 'instance', error: 'throw'}
 */

export function bulkhead(
  threshold: number,
  options?: BulkheadOptions) {

  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    const raise = raiseStrategy(options, DEFAULT_ON_ERROR);
    const scope = createScope(
      options && options.scope || DEFAULT_SCOPE,
      threshold,
      options && options.size);

    descriptor.value = function () {
      const bulkheader = scope.bulkhead(this);

      if (!bulkheader.pass()) {
        return raise(new Error('Limiter queue limit reached.'));
      }

      return bulkheader.run(this, method, arguments);
    };
  };
}
