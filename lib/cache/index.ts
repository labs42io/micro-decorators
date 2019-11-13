import { CacheOptions, DEFAULT_OPTIONS } from './CacheOptions';
import { cacheFactory } from './caches/factory';
import { cacheManagerFactory } from './cacheManager/factory';

export { CacheOptions };

type TimeoutCacheOptions = CacheOptions & { timeout: number; };

/**
 * Caches the result of a method.
 * @param timeout cache timeout in milliseconds.
 * @param options (optional) caching options.
 */
export function cache(timeout: number): MethodDecorator;
export function cache(options: TimeoutCacheOptions): MethodDecorator;
export function cache(timeout: number, options?: CacheOptions): MethodDecorator;
export function cache(
  timeoutOrOptions: number | TimeoutCacheOptions,
  optionsOrVoid: CacheOptions = DEFAULT_OPTIONS,
): MethodDecorator {

  const { timeout, options } = parseParameters(timeoutOrOptions, optionsOrVoid);
  const cacheManager = cacheManagerFactory(timeout, options);

  return function (_: any, __: any, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheService = cacheManager.get(this);
      const wasCached = await cacheService.has(args);

      if (wasCached) {
        return cacheService.get(args);
      }

      try {
        const value = await method(...args);
        cacheService.set(args, value);
        return value;
      } catch (error) {
        return Promise.reject(error);
      }
    };

    return descriptor;
  };
}

function parseParameters(
  timeoutOrOptions: number | TimeoutCacheOptions,
  optionsOrVoid: CacheOptions,
) {

  if (typeof timeoutOrOptions === 'number') {
    return {
      timeout: timeoutOrOptions,
      options: { ...DEFAULT_OPTIONS, ...optionsOrVoid },
    };
  }

  return {
    timeout: timeoutOrOptions.timeout,
    options: { ...DEFAULT_OPTIONS, ...timeoutOrOptions },
  };
}
