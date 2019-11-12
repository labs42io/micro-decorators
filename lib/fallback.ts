export type FallbackOptions = {
  /**
   * Allows to filter only for specific errors.
   * By default all errors are handled.
   */
  errorFilter?: (err: Error) => boolean,
};

/**
 * Allows to provide a substitute value when method call fails or rejects.
 * @param options optional fallback options
 */
export function fallback(valueProvider: (...args: any[]) => any, options?: FallbackOptions): any;
export function fallback(value: any, options?: FallbackOptions): any;
export function fallback(value: any | ((...args: any[]) => any), options?: FallbackOptions): any {

  return function (target: any, propertyKey: any, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = function () {
      try {
        const result = method.call(this, arguments);
        const isPromiseLike = result && typeof result.then === 'function';

        if (isPromiseLike) {
          return fallbackPromise(options, result, value, this);
        }

        return result;

      } catch (err) {
        const isFiltered = filterError(err, options, this);

        if (isFiltered) {
          return getFallbackValue(value, this);
        }

        throw err;
      }
    };

  };
}

function fallbackPromise(
  options: FallbackOptions,
  result: Promise<never>,
  value: any,
  instance: any,
): Promise<any> {

  const reject = (err: any) => {
    const isFiltered = filterError(err, options, instance);

    return isFiltered
      ? Promise.resolve(getFallbackValue(value, instance))
      : Promise.reject(err);
  };

  return result.catch(reject);
}

function filterError(error: Error, options: FallbackOptions, instance: any): boolean {
  if (!options || !options.errorFilter) {
    return true;
  }

  return options.errorFilter.bind(instance)(error);
}

function getFallbackValue(value: any | ((...args: any[]) => any), instance: any): any {
  const isFunction = typeof value === 'function';

  if (isFunction) {
    return value.bind(instance)();
  }

  return value;
}
