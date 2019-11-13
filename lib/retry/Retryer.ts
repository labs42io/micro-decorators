import { raiseStrategy } from '../utils';
import { DEFAULT_ERROR, DEFAULT_ON_ERROR, MethodOptions, RetryOptions } from './RetryOptions';

export class Retryer {
  constructor(
    private readonly options: RetryOptions,
    private readonly methodOptions: MethodOptions,
  ) { }

  public retry(error: Error, attempts: number, count: number): any {
    const { instance } = this.methodOptions;

    if (!attempts || attempts < count || !this.options.errorFilter.bind(instance)(error)) {
      return this.error();
    }

    const { method, args } = this.methodOptions;
    return method.bind(instance)(args);
  }

  private error(): void | Promise<never> {
    const raise = raiseStrategy({ onError: this.options.onError }, DEFAULT_ON_ERROR);
    return raise(new Error(DEFAULT_ERROR));
  }
}
