import { BulkheadOptions, DEFAULT_OPTIONS } from './BulkheadOptions';
import { ExecutionQueueFactory } from './ExecutionQueue/factory';
import { BulkheadFactory } from './Bulkhead/factory';
import { BulkheadProviderFactory } from './BulkheadProvider/factory';
import { BulkheadProvider } from './BulkheadProvider/BulkheadProvider';
import { raiseStrategy } from '../utils';

export { BulkheadOptions };

/**
 * Limits the number of queued concurrent executions of a method.
 * When the limit is reached the execution is delayed and queued.
 * @param threshold the max number of concurrent executions.
 */
export function bulkhead(threshold: number, options: BulkheadOptions): MethodDecorator {
  const bulkheadProvided = createBulkheadProvider(threshold, options);
  const raise = raiseStrategy(options, 'reject');

  return function (_: any, __: any, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args) {
      const bulkhead = bulkheadProvided.get(this);

      try {
        return await bulkhead.run(method.bind(this), args);
      } catch (error) {
        return raise(error);
      }
    };

    return descriptor;
  };
}

function createBulkheadProvider(
  threshold: number,
  { size = undefined, scope = 'class' }: BulkheadOptions = DEFAULT_OPTIONS,
): BulkheadProvider {

  const executionQueueFactory = new ExecutionQueueFactory(size);
  const bulkheadFactory = new BulkheadFactory(threshold, executionQueueFactory);
  return new BulkheadProviderFactory(bulkheadFactory).create(scope);
}
