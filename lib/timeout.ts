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

      const args = arguments;
      const thenable = new Promise(res => res(func.apply(this, args)));

      return Promise.race([expire, thenable])
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
    defaultTimeout = milliseconds;
  }
}

function wait(reject: (e: Error) => void, ms?: number) {
  return setTimeout(
    () => reject(new Error('Timeout.')),
    typeof ms === 'undefined' ? defaultTimeout : ms);
}
