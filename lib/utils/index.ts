import { RetryOptions } from '../retry';

const DEFAULT_ON_ERROR = 'throw';

export function raiseStrategy(options: RetryOptions) {
  const value = options && options.onError || DEFAULT_ON_ERROR;

  switch (value) {
    case 'reject':
      return err => Promise.reject(err);
    case 'throw':
      return (err) => { throw err; };
    case 'ignore':
      return () => { };
    case 'ignoreAsync':
      return () => Promise.resolve();
    default:
      throw new Error(`Option ${value} is not supported for 'behavior'.`);
  }
}
