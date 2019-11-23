import { raiseStrategy } from '../utils';
import { HashService } from '../utils/hash';
import { isPromiseLike } from '../utils/isPromiseLike';
import { CircuitOptions, DEFAULT_OPTIONS } from './CircuitOptions';
import { CircuitStateFactory } from './CircuitState/factory';
import { CircuitStateStorageFactory } from './CircuitStateStorage/factory';
import { PolicyFactory } from './Policy/factory';
import { CircuitStateStorage } from './CircuitStateStorage/CircuitStateStorage';

export { CircuitOptions };

/**
 * A circuit breaker.
 * After the method fails `threshold` count it enters the closed state and
 * throws a `Circuit closed.` error. Once in closed state, the circuit fails
 * for the provided `timeout` milliseconds. After the `timeout` interval expires
 * the circuit transitions to half-opened state and allows next execution.
 * If the execution succeeds then circuit transitions back to open state and resets
 * the number of counted errors to zero.
 * @param threshold the max number of failures until the circuit gets closed.
 * @param timeout timeout in milliseconds to keep the circuit in closed state.
 */
export function circuit(
  threshold: number,
  timeout: number,
  options?: CircuitOptions,
): MethodDecorator {

  const raise = raiseStrategy(options, 'throw');
  const circuitStateStorage = createCircuitStateStorage(threshold, timeout, options);

  return function (_: any, propertyKey: any, descriptor: PropertyDescriptor) {
    const method: (...args: any[]) => any = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const state = circuitStateStorage.get(args, this);
      const allowExecution = state.allowExecution();

      if (!allowExecution) {
        return raise(new Error(`@circuit: method ${propertyKey} is blocked.`));
      }

      function successRegister<T = any>(data: T) {
        state.register();

        return data;
      }

      function errorRegister(error: Error) {
        state.register(error);

        return raise(error);
      }

      try {
        const result = method.apply(this, args);

        if (isPromiseLike(result)) {
          return result.then(
            data => successRegister(data),
            error => errorRegister(error) as any,
          );
        }

        return successRegister(result);
      } catch (error) {
        return errorRegister(error);
      }
    };

    return descriptor;
  };

}

function createCircuitStateStorage(
  threshold: number,
  timeout: number,
  options: CircuitOptions = DEFAULT_OPTIONS,
): CircuitStateStorage {

  const { interval, errorFilter = () => true, scope = 'class', policy = 'errors' } = options;

  const hashService = new HashService();
  const policyFactory = new PolicyFactory(threshold);
  const cirucitStateFactory =
    new CircuitStateFactory(timeout, interval, errorFilter, policyFactory, policy);
  return new CircuitStateStorageFactory(cirucitStateFactory, hashService).create(scope);
}
