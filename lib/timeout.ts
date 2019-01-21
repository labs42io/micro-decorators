let defaultTimeout: number = 60000;

/**
 * Specifies how long a method should execute.
 * If the specified timeout in milliseconds is exceeded then a `Timeout.` error is thrown.
 * @param milliseconds timeout in milliseconds.
 * If no value is provided, then default is used. See `timeout.current`.
 */
export function timeout(milliseconds?: number) {
  return function (target: any, propertyKey: any, descriptor: PropertyDescriptor) {
    const func = descriptor.value;

    descriptor.value = function () {
      let timeoutId;
      const expire = new Promise((_, rej) => {
        timeoutId = wait(rej, milliseconds);
      });

      return Promise.race([expire, func.apply(this, arguments)])
        .then(
          (res) => {
            clearTimeout(timeoutId);
            return res;
          },
          (err) => {
            clearTimeout(timeoutId);
            return Promise.reject(err);
          });
    };
  };
}

export namespace timeout {
  /**
   * Sets the default value for all timeouts.
   * @param milliseconds timeout in milliseconds.
   */
  export function current(milliseconds: number): void {
    if (milliseconds < 1) {
      throw new Error('Invalid timeout value. Provide a value greater than 0.');
    }

    defaultTimeout = milliseconds;
  }
}

function wait(reject: (e: Error) => void, ms?: number) {
  return setTimeout(
    () => reject(new Error('Timeout.')),
    typeof ms === 'undefined' ? defaultTimeout : ms);
}
