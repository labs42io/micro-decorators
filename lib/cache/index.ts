import { CacheOptions, DEFAULT_SCOPE, DEFAULT_OPTIONS } from './CacheOptions';
import { initializeCacheService } from './InitializeCacheService';
import { Cache } from './Cache';
import { StorageType } from './StorageType';

export { CacheOptions };

/**
 * Caches the result of a method.
 * @param timeout cache timeout in milliseconds.
 * @param options (optional) caching options.
 */
export function cache(timeout: number, options: CacheOptions = DEFAULT_OPTIONS) {
  const scope = options ? options.scope : DEFAULT_SCOPE;

  return function (target: any, propertyKey: any, descriptor: PropertyDescriptor) {
    const initialFunction = descriptor.value;
    const storage =
      scope === 'class'
        ? initializeCacheService<IArguments, any>(timeout, options)
        : new WeakMap<any, Cache<IArguments, any>>();

    descriptor.value = function () {
      const cache = storage instanceof Cache
        ? storage
        : returnDataFromStorage(
          storage,
          this,
          () => initializeCacheService(timeout, options),
        );
      return returnDataFromStorage(cache as any, arguments, initialFunction);
    };

    return descriptor;
  };
}

function returnDataFromStorage<K, V>(
  storage: StorageType<K, V>,
  key: K,
  getValue: (key: K) => V,
): V {
  if (!storage.has(key)) {
    storage.set(key, getValue(key));
  }

  return storage.get(key);
}
