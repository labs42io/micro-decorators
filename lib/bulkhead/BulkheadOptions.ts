export type BulkheadOptions = {
  /**
   * The scope of limiter.
   * The `class` (default) scope defines a single method scope for all class instances.
   * The `instance` scope defines a per-instance method scope.
   */
  scope?: 'instance' | 'class',

  /**
   * The max size of the pending queue. By default not limited.
   */
  size?: number,

  /**
   * Sets the behavior of handling the case when queue limit is reached.
   * When `throw` then throws immediately with an error.
   * When `reject` (default) then returns a rejected promise with error
   * `Limiter queue limit reached.`.
   * When `ignore` then doesn't throw any error and immediately
   * terminates execution (returns undefined).
   * When `ignoreAsync` then doesn't throw any error and immediately
   * returns a resolved promise.
   */
  onError?: 'throw' | 'reject' | 'ignore' | 'ignoreAsync',
};

export const DEFAULT_SIZE = 0;
export const DEFAULT_SCOPE = 'instance';
export const DEFAULT_ON_ERROR = 'throw';
