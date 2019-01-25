export type BulkheadOptions = {
  /**
   * The scope of limiter.
   * The `class` (default) scope defines a single method scope for all class instances.
   * The `instance` scope defines a per-instance method scope.
   */
  scope?: 'class' | 'instance',

  /**
   * The max size of the execution queue. By default not limited.
   */
  size?: number,

  /**
   * Sets the behavior of handling the case when queue limit is reached.
   * When `reject` (default) then returns a rejected promise with error
   * `Limiter queue limit reached.`.
   * When `throw` then throws immediately with an error.
   * When `ignore` then doesn't throw any error and immediately
   * terminates execution (returns undefined).
   * When `ignoreAsync` then doesn't throw any error and immediately
   * returns a resolved promise.
   */
  behavior?: 'throw' | 'reject' | 'ignore' | 'ignoreAsync',
};

/**
 * Limits the number of queued concurrent executions of a method.
 * When the limit is reached the execution is delayed and queued.
 * @param threshold the max number of concurrent executions.
 */
export function bulkhead(threshold: number) {
  throw new Error('Not implemented.');
}
