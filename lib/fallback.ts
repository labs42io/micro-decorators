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
        const isPromiseLike = result instanceof Promise;

        if (isPromiseLike) {
          return fallbackPromise(options, value, result, this);
        }

        return result;

      } catch (err) {
        const isFiltered = filterError(err, options);

        if (isFiltered) {
          return getFallbackValue(value, this);
        }

        throw new Error(err.message);
      }
    };

  };
}

function fallbackPromise(
  options: FallbackOptions,
  value: any,
  result: any,
  instance: any,
): Promise<any> {

  const resolve = (response: any) => {
    return Promise.resolve(response);
  };

  const reject = (err: any) => {
    const isFiltered = filterError(err, options);

    return isFiltered
      ? Promise.resolve(getFallbackValue(value, instance))
      : Promise.reject(err);
  };

  return Promise.resolve(result).then(resolve, reject);
}

function filterError(error: Error, options: FallbackOptions): boolean {
  if (!options || !options.errorFilter) {
    return true;
  }

  return options.errorFilter(error);
}

function getFallbackValue(value: any | ((...args: any[]) => any), instance: any): any {
  const isFunction = typeof value === 'function';

  if (isFunction) {
    return value.bind(instance)();
  }

  return value;
}
