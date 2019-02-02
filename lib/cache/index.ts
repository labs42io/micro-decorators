import { CacheOptions, DEFAULT_SCOPE, DEFAULT_OPTIONS } from './CacheOptions';
import { initializeCacheService } from './InitializeCacheService';
import { Cache } from './Cache';

export { CacheOptions };

/**
 * Caches the result of a method.
 * @param timeout cache timeout in milliseconds.
 * @param options (optional) caching options.
 */
export function cache(timeout: number, options: CacheOptions = DEFAULT_OPTIONS) {
  const scope = options ? options.scope : DEFAULT_SCOPE;
  return scope === 'class' ? cacheClass(timeout, options) : cacheInstance(timeout, options);
}

function cacheClass(timeout: number, options?: CacheOptions) {
  return function (target: any, propertyKey: any, descriptor: PropertyDescriptor) {
    const cache = initializeCacheService<IArguments, any>(timeout, options);
    const initialFunction = descriptor.value;

    descriptor.value = function () {
      return returnData(cache, arguments, initialFunction);
    };

    return descriptor;
  };
}

function cacheInstance(timeout: number, options?: CacheOptions) {
  return function (target: any, propertyKey: any, descriptor: PropertyDescriptor) {
    const initialFunction = descriptor.value;
    const storage = new WeakMap<any, Cache<IArguments, any>>();

    descriptor.value = function () {
      if (!storage.has(this)) {
        storage.set(this, initializeCacheService(timeout, options));
      }

      const cache = storage.get(this);

      return returnData(cache, arguments, initialFunction);
    };

    return descriptor;
  };
}

function returnData(cache: Cache<IArguments, any>, args: IArguments, func: Function): any {
  if (!cache.has(args)) {
    cache.add(args, func(args));
  }

  return cache.get(args);
}
