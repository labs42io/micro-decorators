import { CacheOptions, DEFAULT_OPTIONS } from './CacheOptions';
import { cacheFactory } from './factories/cacheFactory';

export { CacheOptions };

interface CacheOptionsAndTimeout extends CacheOptions {
  timeout: number;
}

/**
 * Caches the result of a method.
 * @param timeout cache timeout in milliseconds.
 * @param options (optional) caching options.
 */
export function cache(timeout: number): MethodDecorator;
export function cache(options: CacheOptionsAndTimeout): MethodDecorator;
export function cache(timeout: number, options?: CacheOptions): MethodDecorator;
export function cache(
  timeoutOrOptions: number | CacheOptionsAndTimeout,
  optionsOrVoid: CacheOptions = DEFAULT_OPTIONS,
): MethodDecorator {

  const { timeout, options } = parseParameters(timeoutOrOptions, optionsOrVoid);
  const cacheService = cacheFactory(timeout, options);

  return function (_: any, __: any, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cachedValue = cacheService.get(args, this);
      if (cachedValue) {
        return cachedValue;
      }

      try {
        const value = method(...args);
        cacheService.set(args, value, this);
        return value;
      } catch (error) {
        return Promise.reject(error);
      }
    };

    return descriptor;
  };
}

interface Parameters {
  timeout: number;
  options: CacheOptions;
}

function parseParameters(
  timeoutOrOptions: number | CacheOptionsAndTimeout,
  optionsOrVoid: CacheOptions,
): Parameters {
  if (typeof timeoutOrOptions === 'number') {
    return {
      timeout: timeoutOrOptions,
      options: { ...DEFAULT_OPTIONS, ...optionsOrVoid || {} },
    };
  }

  return {
    timeout: timeoutOrOptions.timeout,
    options: { ...DEFAULT_OPTIONS, ...timeoutOrOptions },
  };
}
