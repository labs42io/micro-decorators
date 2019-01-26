export type ThrottleOptions = {

  /**
   * Time interval of throttling limit.
   * When a custom number is provided is used as milliseconds.
   * Defaults to `second`.
   */
  interval?: 'second' | 'minute' | number;

  /**
   * The scope of method throttling.
   * The `args-hash` (default) scope defines as a scope the arguments list
   * (for all class instances). See `object-hash` package for details about
   * calculating the hash of arguments.
   * The `class` scope defines a single method scope for all class instances.
   * The `instance` scope defines a per-instance method scope (regardless of arguments list).
   */
  scope?: 'args-hash' | 'class' | 'instance',

  /**
   * Sets the behavior of handling throttle limit.
   * When `throw` (default) then in case of reached limit throws immediately with an error.
   * When `reject` then returns a rejected promise with an error.
   * When `ignore` then doesn't throw any error and immediately
   * terminates execution (returns undefined).
   * When `ignoreAsync` then doesn't throw any error and immediately
   * returns a resolved promise.
   */
  onError?: 'throw' | 'reject' | 'ignore' | 'ignoreAsync',
};

export const DEFAULT_INTERVAL = 1000;
export const DEFAULT_SCOPE = 'args-hash';
export const DEFAULT_ON_ERROR = 'throw';
