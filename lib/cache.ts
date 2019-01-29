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
    console.log(target, propertyKey, descriptor);
    descriptor.value = function (...args) {
      console.log(target, propertyKey, descriptor);
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

  constructor(public readonly timeout: number) { }

  public add(key: K, value: V): void {
    this.setCache(key, value);
  }

  public has(key: K): boolean {
    if (!this.map.has(key)) {
      return false;
    }

    const data = this.map.get(key);
    clearTimeout(data.timeout);
    this.setCache(key, data.value);

    return true;
  }

  public get(key: K): V {
    const defaultValue = { value: undefined };
    return (this.map.get(key) || defaultValue).value;
  }

  private setCache(key: K, value: V): void {
    const timeout = setTimeout(
      () => {
        this.map.delete(key);
      },
      this.timeout,
    );

    const data: CacheValue<V> = { timeout, value };
    this.map.set(key, data);
  }
}
