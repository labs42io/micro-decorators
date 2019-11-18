import { CacheOptions, DEFAULT_OPTIONS } from './CacheOptions';
import { ExpirationFactory } from './expirations/factory';
import { StorageFactory } from './storages/factory';
import { CacheFactory } from './caches/factory';
import { HashService } from '../utils/hash';
import { CacheProviderFactory } from './cacheProvider/factory';
import { CacheProvider } from './cacheProvider/CacheProvider';

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
  const cacheProvider = createCacheProvider(timeout, options);

  return function (_: any, __: any, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheService = cacheProvider.get(this);
      const isCached = await cacheService.has(args);

      if (isCached) {
        return cacheService.get(args);
      }

      const value = await method(...args);
      cacheService.set(args, value);
      return value;
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

function createCacheProvider(timeout: number, options: CacheOptions): CacheProvider {
  const hashService = new HashService();
  const expirationFactory = new ExpirationFactory(timeout, options.expiration);
  const storageFactory = new StorageFactory(options.size, options.storage);
  const cacheFactory = new CacheFactory(hashService, expirationFactory, storageFactory);

  return new CacheProviderFactory(options.scope, cacheFactory).create();
}
