export type CacheOptions = {
  /**
   * The expiration strategy.
   * `absolute` (default) strategy expires after the the set amount of time.
   * `sliding` strategy expires after the method hasn't been called in a set amount of time.
   */
  expiration: 'absolute' | 'sliding', // TODO: allow custom policy to be injected

  /**
   * The cache scope.
   * The `class` (default) scope defines a single method scope for all class instances.
   * The `instance` scope defines a per-instance method scope.
   * The hash key is calculated using `object-hash` of current arguments list.
   */
  scope?: 'class' | 'instance',

  /**
   * The storage strategy.
   * The `memory` (default) strategy uses an in-memory map.
   */
  storage?: 'memory', // TODO: add support for redis and custom providers

  /**
   * When specified defines the max number of cache keys.
   * By default the number of keys are not limited.
   */
  size?: number,
};

/**
 * Caches the result of a method.
 * @param timeout cache timeout in milliseconds.
 * @param options (optional) caching options.
 */
export function cache(timeout: number, options?: CacheOptions) {
  throw new Error('Not implemented.');
}
