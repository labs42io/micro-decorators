export type BulkheadOptions = {
  /**
   * The scope of limiter.
   * The `class` (default) scope defines a single method scope for all class instances.
   * The `instance` scope defines a per-instance method scope.
   */
  scope?: 'class' | 'instance',

  /**
   * The max size of the pending queue. By default not limited.
   */
  size?: number,

  /**
   * Sets the behavior of handling the case when queue limit is reached.
   * When `reject` (default) then returns a rejected promise with error
   * When `ignoreAsync` then doesn't throw any error and immediately
   * returns a resolved promise.
   */
  onError?: 'reject' | 'ignoreAsync',
};

export const DEFAULT_OPTIONS: Readonly<BulkheadOptions> = {
  scope: 'class',
  onError: 'reject',
  size: undefined,
};
