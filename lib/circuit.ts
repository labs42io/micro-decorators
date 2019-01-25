export type CircuitOptions = {
  /**
   * Allows to limit a time interval (in milliseconds) for counting the errors.
   * By default errors are counted for an infinite amount of time until
   * the circuit gets in closed state.
   */
  interval?: number,

  /**
   * Sets the behavior of handling closed circuit state.
   * When `throw` (default) then throws immediately with an error.
   * When `reject` then returns a rejected promise with an error.
   * When `ignore` then doesn't throw any error and immediately
   * terminates execution (returns undefined).
   * When `ignoreAsync` then doesn't throw any error and immediately
   * returns a resolved promise.
   */
  behavior?: 'throw' | 'reject' | 'ignore' | 'ignoreAsync',

  /**
   * The scope of circuit breaker.
   * The `class` (default) scope defines a single method scope for all class instances.
   * The `instance` scope defines a per-instance method scope.
   */
  scope?: 'args-hash' | 'class' | 'instance',

  /**
   * Allows to filter only for specific errors.
   * By default all errors are counted by the circuit.
   */
  errorFilter?: (err: Error) => boolean,
};

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
export function circuit(threshold: number, timeout: number, options?: CircuitOptions) {
  throw new Error('Not implemented.');
}
