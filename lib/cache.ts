import * as hash from 'object-hash';

export type CacheOptions = {
  /**
   * The expiration strategy.
   * `absolute` (default) strategy expires after the the set amount of time.
   * `sliding` strategy expires after the method hasn't been called in a set amount of time.
   */
  expiration?: 'absolute' | 'sliding', // TODO: allow custom policy to be injected

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
  return function (target: any, propertyKey: any, descriptor: PropertyDescriptor) {
    const initialFunction = descriptor.value;
    descriptor.value = function (...args) {
      return initialFunction(...args);
    };
    return descriptor;
  };
}

interface CacheValue<V> {
  timeout: NodeJS.Timeout;
  value: V;
}

class Cahce<K, V> {
  private readonly map = new Map<K, CacheValue<V>>();

  constructor(
    public readonly timeout: number,
    public readonly size: number,
  ) { }

  public add(key: K, value: V): void {
    this.has(key)
      ? this.resetCache(key, value)
      : this.setCache(key, value);
  }

  public has(key: K): boolean {
    if (!this.map.has(key)) {
      return false;
    }

    this.resetCache(key, this.get(key));

    return true;
  }

  public get(key: K): V {
    const defaultValue = { value: undefined };
    return (this.map.get(key) || defaultValue).value;
  }

  private resetCache(key: K, value: V): void {
    this.deleteCahce(key);
    this.setCache(key, value);
  }

  private deleteCahce(key: K): void {
    const value = this.map.get(key);
    clearTimeout(value.timeout);
    this.map.delete(key);
  }

  private setCache(key: K, value: V): void {
    const timeout = setTimeout(
      () => this.map.delete(key),
      this.timeout,
    );

    const data: CacheValue<V> = { timeout, value };
    this.map.set(key, data);
  }
}
