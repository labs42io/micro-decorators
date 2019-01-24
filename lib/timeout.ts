let defaultTimeout: number = 60000;

/**
 * Specifies how long a method should execute.
 * If the specified timeout in milliseconds is exceeded then a `Timeout.` error is thrown.
 * @param milliseconds timeout in milliseconds.
 * If no value is provided, then default is used. See `timeout.current`.
 */
export function timeout(milliseconds?: number) {
  return function (target: any, propertyKey: any, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = function () {
      const result = method.apply(this, arguments);
      const isPromiseLike = result && typeof result.then === 'function';

      if (!isPromiseLike) {
        console.warn(`Used @timeout for sync method '${propertyKey}'.`);
        return result;
      }

      let timeoutId;
      const expire = new Promise((_, rej) => {
        timeoutId = wait(rej, milliseconds);
      });

      const resolve = (res) => {
        clearTimeout(timeoutId);
        return res;
      };

      const reject = (err) => {
        clearTimeout(timeoutId);
        return Promise.reject(err);
      };

      return Promise.race([expire, result]).then(resolve, reject);
    };
  };
}

export namespace timeout {
  /**
   * Sets the default value for all timeouts.
   * @param milliseconds timeout in milliseconds.
   */
  export function current(milliseconds: number): void {
    defaultTimeout = milliseconds;
  }
}

function wait(reject: (e: Error) => void, ms?: number) {
  return setTimeout(
    () => reject(new Error('Timeout.')),
    typeof ms === 'undefined' ? defaultTimeout : ms);
}
