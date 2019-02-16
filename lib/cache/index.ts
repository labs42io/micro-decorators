import { CacheOptions, DEFAULT_SCOPE, DEFAULT_OPTIONS } from './CacheOptions';
import { CacheFactory as CacheFactory } from './Create';
import { Cache } from './Cache';
import { Storage } from './Storage';
import { ClassType } from '../interfaces/class';
import { checkOptions } from './checkCacheOptions';

export { CacheOptions };

/**
 * Caches the result of a method.
 * @param timeout cache timeout in milliseconds.
 * @param options (optional) caching options.
 */
export function cache(timeout: number, options: CacheOptions = DEFAULT_OPTIONS) {
  checkOptions(options);
  const scope = options ? options.scope : DEFAULT_SCOPE;

  return function (target: any, propertyKey: any, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    const storage =
      scope === 'class'
        ? CacheFactory<any[]>(timeout, options)
        : new WeakMap<ClassType, Cache<any[]>>();

    descriptor.value = replaceMethod(method, storage, timeout, options);

    return descriptor;
  };
}

function replaceMethod(
  method: Function,
  storage: Cache<any[]> | WeakMap<ClassType<any>, Cache<any[]>>,
  timeout: number,
  options: CacheOptions,
): Function {
  return function (...args) {
    const cache = storage instanceof Cache
      ? storage
      : returnDataFromStorage(
        storage as any,
        this,
        () => CacheFactory(timeout, options),
      );

    const response = returnDataFromStorage(
      cache as any,
      args,
      () => method(...args),
    );

    return response instanceof Promise ? Promise.resolve(response) : response;
  };
}

function returnDataFromStorage<K, V>(
  storage: Storage<K>,
  key: K,
  getValue: (key: K) => V,
): V {
  if (!storage.has(key)) {
    storage.set(key, getValue(key));
  }

  return storage.get(key);
}
