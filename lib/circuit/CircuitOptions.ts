export type CircuitOptions = {
  /**
   * Allows to limit a time interval (in milliseconds) for counting the errors.
   * By default errors are counted for an infinite amount of time until
   * the circuit gets in closed state.
   */
  interval?: number,

  /**
   * Specifies how to calculate the threshold for circuit.
   * The `errors` policy counts only for failures and expects an
   * integer number for `threshold` option.
   * The `rate` policy calculates the rate of failures as:
   * rate = number_of_failures / number_of_total_calls
   * and expects a number between 0 and 1 for `threshold` option.
   */
  policy?: 'errors' | 'rate',

  /**
   * Sets the behavior of handling closed circuit state.
   * When `throw` (default) then throws immediately with an error.
   * When `reject` then returns a rejected promise with an error.
   * When `ignore` then doesn't throw any error and immediately
   * terminates execution (returns undefined).
   * When `ignoreAsync` then doesn't throw any error and immediately
   * returns a resolved promise.
   */
  onError?: 'throw' | 'reject' | 'ignore' | 'ignoreAsync',

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

export const DEFAULT_INTERVAL = undefined;
export const DEFAULT_POLICY = 'errors';
export const DEFAULT_ON_ERROR = 'throw';
export const DEFAULT_SCOPE = 'class';
export const DEFAULT_ERROR_FILTER = () => true;
export const DEFAULT_OPTIONS: Readonly<CircuitOptions> = {
  interval: DEFAULT_INTERVAL,
  policy: DEFAULT_POLICY,
  onError: DEFAULT_ON_ERROR,
  scope: DEFAULT_SCOPE,
  errorFilter: DEFAULT_ERROR_FILTER,
};
