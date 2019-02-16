import { CacheOptions, DEFAULT_OPTIONS } from './CacheOptions';
import { checkOptions } from './CheckOptions';
import { cacheFactory } from './factories/cacheFactory';

export { CacheOptions };

/**
 * Caches the result of a method.
 * @param timeout cache timeout in milliseconds.
 * @param options (optional) caching options.
 */
export function cache(timeout: number, options: CacheOptions = DEFAULT_OPTIONS) {
  checkOptions(options);

  return function (target: any, propertyKey: any, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    const storage = cacheFactory<any[]>(timeout, options);

    descriptor.value = function (...args) {
      if (storage.has(args, this)) {
        const result = storage.get(args, this);
        return result instanceof Promise ? Promise.resolve(result) : result;
      }

      const result = method(...args);
      storage.set(args, result, this);
      return result;
    };

    return descriptor;
  };
}
